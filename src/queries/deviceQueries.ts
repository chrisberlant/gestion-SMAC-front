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

export const useGetAllDevices = () => {
	return useQuery({
		queryKey: ['devices'],
		queryFn: async () => {
			return (await fetchApi('/getAllDevices')) as DeviceType[];
		},
	});
};

export const useCreateDevice = () => {
	return useMutation({
		mutationFn: async (device: DeviceCreationType) => {
			return (await fetchApi(
				'/createDevice',
				'POST',
				device
			)) as DeviceType;
		},

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
			toast.success('Appareil créé avec succès');
		},
		onError: (_, __, previousDevices) => {
			if (previousDevices)
				queryClient.setQueryData(['devices'], previousDevices);
		},
	});
};

export const useUpdateDevice = () => {
	return useMutation({
		mutationFn: async ({
			data,
		}: {
			data: DeviceUpdateType;
			updateLine?: boolean;
		}) => {
			return (await fetchApi(
				'/updateDevice',
				'PATCH',
				data
			)) as DeviceType;
		},

		onMutate: async (updatedDevice) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			const previousLines = queryClient.getQueryData(['lines']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices.map((device) =>
					device.id === updatedDevice.data.id
						? updatedDevice.data
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
};

export const useDeleteDevice = () => {
	return useMutation({
		mutationFn: async (deviceId: number) => {
			return await fetchApi('/deleteDevice', 'DELETE', {
				id: deviceId,
			});
		},

		onMutate: async (deviceIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices?.filter((device) => device.id !== deviceIdToDelete)
			);
			return previousDevices;
		},
		onSuccess: () => toast.success('Appareil supprimé avec succès'),
		onError: (_, __, previousDevices) =>
			queryClient.setQueryData(['devices'], previousDevices),
	});
};

// Exporter les appareils en CSV
export const useExportDevicesToCsv = () => {
	return useQuery({
		queryKey: ['devicesCsv'],
		queryFn: async () => await fetchApi('/exportDevicesCsvFile'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};

// Créer des appareils à partir d'un CSV
export const useImportMultipleDevices = (
	toggleOverlay: () => void,
	closeImportModal: () => void
) => {
	return useMutation({
		mutationFn: async (importedDevices: object[]) => {
			toggleOverlay();
			return await fetchApi(
				'/importMultipleDevices',
				'POST',
				importedDevices
			);
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
			// Si IMEI déjà existants, l'API renvoie ceux concernés
			if (/\d+/.test(error.message))
				return displayAlreadyExistingValuesOnImportModal({
					values: error.message,
					text: 'Certains IMEI fournis sont déjà existants :',
				});
			// Si Zod renvoie un message indiquant un problème dans le format du CSV
			toast.error('Format du CSV incorrect');
		},
		onSettled: () => {
			toggleOverlay();
			closeImportModal();
		},
	});
};

// Générer le template CSV
export const useGetDevicesCsvTemplate = () => {
	return useQuery({
		queryKey: ['devicesCsv'],
		queryFn: async () => await fetchApi('/generateEmptyDevicesCsvFile'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};
