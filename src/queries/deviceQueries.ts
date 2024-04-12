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
			const previousDevices = queryClient.getQueryData(['devices']);
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
						agent.id === newDevice.agentId
							? {
									...agent,
									devices: [
										...agent.devices,
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
		onError: (_, __, previousDevices) =>
			queryClient.setQueryData(['devices'], previousDevices),
	});
};

export const useUpdateDevice = () =>
	useMutation({
		mutationFn: async (data: DeviceUpdateType) => {
			const { id, ...infos } = data;
			return (await fetchApi(
				`/device/${id}`,
				'PATCH',
				infos
			)) as DeviceType;
		},
		onMutate: async (deviceToUpdate) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices.map((device) =>
					device.id === deviceToUpdate.id
						? { ...device, ...deviceToUpdate }
						: device
				)
			);
			return previousDevices;
		},
		onSuccess: (receivedData, sentData) => {
			// Mise à jour de l'IMEI de l'appareil dans la liste du propriétaire si celui-ci est le même
			if (sentData.imei && !sentData.agentId)
				queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
					agents.map((agent) =>
						agent.devices.some(
							(device) => device.id === sentData.id
						)
							? {
									...agent,
									devices: agent.devices.map((device) =>
										device.id === sentData.id
											? {
													...device,
													imei: sentData.imei,
											  }
											: device
									),
							  }
							: agent
					)
				);

			// Mise à jour des appareils dans les listes des agents si le propriétaire a changé
			if (sentData.agentId) {
				queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
					agents.map((agent) => {
						if (
							agent.id !== sentData.agentId &&
							agent.devices.some(
								(device) => device.id === sentData.id
							)
						) {
							// Retrait de la liste de l'ancien propriétaire
							return {
								...agent,
								devices: agent.devices.filter(
									(device) => device.id !== receivedData.id
								),
							};
						}
						if (agent.id === sentData.agentId) {
							return {
								// Ajout à la liste du nouveau propriétaire
								...agent,
								devices: [
									...agent.devices,
									{
										id: receivedData.id,
										imei: receivedData.imei,
									},
								],
							};
						}
						return agent;
					})
				);

				// Mise à jour du cache des lignes s'il existe
				if (queryClient.getQueryData(['lines']))
					queryClient.setQueryData(['lines'], (lines: LineType[]) =>
						lines.map((line) =>
							line.deviceId === sentData.id
								? { ...line, agentId: receivedData.agentId }
								: line
						)
					);
			}

			toast.success('Appareil modifié avec succès');
		},
		onError: (_, __, previousDevices) => {
			queryClient.setQueryData(['devices'], previousDevices);
		},
	});

export const useDeleteDevice = () =>
	useMutation({
		mutationFn: async ({
			deviceId,
		}: {
			deviceId: number;
			ownerId: number | null;
			lineUsingDeviceId: number | undefined;
		}) => await fetchApi(`/device/${deviceId}`, 'DELETE'),
		onMutate: async (data) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices?.filter((device) => device.id !== data.deviceId)
			);
			return previousDevices;
		},
		onSuccess: (_, sentData) => {
			// Suppression de l'appareil de la liste des appareils de son propriétaire s'il existe
			if (sentData.ownerId)
				queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
					agents.map((agent) =>
						agent.id === sentData.ownerId
							? {
									...agent,
									devices: agent.devices.filter(
										(device) =>
											device.id !== sentData.deviceId
									),
							  }
							: agent
					)
				);
			// Suppression de l'appareil de la ligne à laquelle il est affecté
			if (
				sentData.lineUsingDeviceId &&
				queryClient.getQueryData(['lines'])
			)
				queryClient.setQueryData(['lines'], (lines: LineType[]) =>
					lines.map((line) =>
						line.id === sentData.lineUsingDeviceId
							? {
									...line,
									deviceId: null,
							  }
							: line
					)
				);
			toast.success('Appareil supprimé avec succès');
		},
		onError: (_, __, previousDevices) => {
			// Rollback des données
			queryClient.setQueryData(['devices'], previousDevices);
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
