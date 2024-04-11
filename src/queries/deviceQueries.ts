import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	DeviceType,
	DeviceCreationType,
	DeviceUpdateType,
} from '@customTypes/device';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';
import { LineType } from '@customTypes/line';
import displayAlreadyExistingValuesOnImportModal from '../modals/alreadyExistingValuesOnImportModal';
import { AgentType } from '../types/agent';

export const useGetAllDevices = () => {
	return useQuery({
		queryKey: ['devices'],
		queryFn: async () => {
			return (await fetchApi('/devices')) as DeviceType[];
		},
	});
};

export const useCreateDevice = () => {
	return useMutation({
		mutationFn: async (device: DeviceCreationType) =>
			(await fetchApi('/device', 'POST', device)) as DeviceType,
		onMutate: async (newDevice) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices: DeviceType[] | undefined =
				queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) => [
				...devices,
				{
					...newDevice,
				},
			]);
			return previousDevices;
		},
		onSuccess: (newDevice) => {
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices.map((device) =>
					device.imei === newDevice.imei
						? { ...device, id: newDevice.id }
						: device
				)
			);
			// Si un agent est associé mise à jour de sa liste d'appareils
			if (newDevice.agentId) {
				queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
					agents.map((agent) =>
						agent.id === newDevice.id
							? {
									...agent,
									devices: [
										agent.devices,
										{
											id: newDevice.id,
											imei: newDevice.imei,
										},
									],
							  }
							: agent
					)
				);
			}
			toast.success('Appareil créé avec succès');
		},
		onError: (_, __, previousDevices) => {
			if (previousDevices)
				queryClient.setQueryData(['devices'], previousDevices);
		},
	});
};

export const useUpdateDevice = () =>
	useMutation({
		mutationFn: async ({
			data,
		}: {
			data: DeviceUpdateType;
			updateLine?: boolean;
		}) => {
			const { id, ...infos } = data;
			return (await fetchApi(
				`/device/${id}`,
				'PATCH',
				infos
			)) as DeviceType;
		},
		onMutate: async (updatedDevice) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			const previousLines = queryClient.getQueryData(['lines']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices.map((device) =>
					device.id === updatedDevice.data.id
						? { ...device, ...updatedDevice.data }
						: device
				)
			);

			// Mise à jour du propriétaire de la ligne si l'appareil y est affecté
			if (updatedDevice.updateLine) {
				queryClient.setQueryData(['lines'], (lines: LineType[]) =>
					lines.map((line) =>
						line.deviceId === updatedDevice.data.id
							? { ...line, agentId: updatedDevice.data.agentId }
							: line
					)
				);
			}

			return { previousDevices, previousLines };
		},
		// TODO mettre à jour les appareils des agents
		onSuccess: () => toast.success('Appareil modifié avec succès'),
		onError: (_, { updateLine }, previousValues) => {
			queryClient.setQueryData(
				['devices'],
				previousValues?.previousDevices
			);
			if (updateLine)
				queryClient.setQueryData(
					['lines'],
					previousValues?.previousLines
				);
		},
	});

export const useDeleteDevice = () =>
	useMutation({
		mutationFn: async ({
			deviceId,
		}: {
			deviceId: number;
			lineUsingDeviceId: number | undefined;
		}) => await fetchApi(`/device/${deviceId}`, 'DELETE'),
		onMutate: async (data) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			const previousAgents = queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices?.filter((device) => device.id !== data.deviceId)
			);

			// Suppression de l'appareil de la liste des appareils de son propriétaire
			if (data.lineUsingDeviceId) {
				queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
					agents.map((agent) => {
						agent.devices.some(
							(device) => device.id === data.deviceId
						)
							? {
									...agent,
									devices: agent.devices.filter(
										(device) => device.id !== data.deviceId
									),
							  }
							: agent;
					})
				);
			}

			return { previousDevices, previousAgents };
		},
		onSuccess: () => toast.success('Appareil supprimé avec succès'),
		onError: (_, { lineUsingDeviceId }, previousValues) => {
			// Rollback des données
			queryClient.setQueryData(
				['devices'],
				previousValues?.previousDevices
			);
			if (lineUsingDeviceId)
				queryClient.setQueryData(
					['agents'],
					previousValues?.previousAgents
				);
		},
	});

// Exporter les appareils en CSV
export const useExportDevicesToCsv = () =>
	useQuery({
		queryKey: ['devicesCsv'],
		queryFn: async () => await fetchApi('/devices/csv'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});

// Créer des appareils à partir d'un CSV
export const useImportMultipleDevices = (
	toggleOverlay: () => void,
	closeImportModal: () => void
) =>
	useMutation({
		mutationFn: async (importedDevices: object[]) => {
			toggleOverlay();
			return await fetchApi('/devices/csv', 'POST', importedDevices);
		},
		meta: {
			importMutation: 'true',
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['devices'] });
			toast.success('Appareils importés avec succès');
		},
		onError: (error) => {
			// Si IMEI déjà existants, la modale est affichée
			if (/\d{15}/.test(error.message))
				return displayAlreadyExistingValuesOnImportModal({
					text: 'Certains IMEI fournis sont déjà existants :',
					values: error.message.split(','),
				});
			// Si Zod renvoie un message indiquant un problème dans le format du CSV
			toast.error('Format du CSV incorrect');
		},
		onSettled: () => {
			toggleOverlay();
			closeImportModal();
		},
	});

// Générer le template CSV
export const useGetDevicesCsvTemplate = () =>
	useQuery({
		queryKey: ['devicesCsv'],
		queryFn: async () => await fetchApi('/devices/csv-template'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
