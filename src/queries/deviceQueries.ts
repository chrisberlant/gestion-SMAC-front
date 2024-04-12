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

export const useGetAllDevices = () =>
	useQuery({
		queryKey: ['devices'],
		queryFn: async () => {
			return (await fetchApi('/devices')) as DeviceType[];
		},
	});

export const useCreateDevice = () =>
	useMutation({
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
			toast.success('Appareil créé avec succès');
		},
		onError: (_, __, previousDevices) =>
			queryClient.setQueryData(['devices'], previousDevices),
	});

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
		onSuccess: (receivedData) => {
			// Mise à jour du cache des lignes s'il existe
			if (queryClient.getQueryData(['lines']))
				queryClient.setQueryData(['lines'], (lines: LineType[]) =>
					lines.map((line) =>
						line.deviceId === receivedData.id
							? { ...line, agentId: receivedData.agentId }
							: line
					)
				);

			toast.success('Appareil modifié avec succès');
		},
		onError: (_, __, previousDevices) => {
			queryClient.setQueryData(['devices'], previousDevices);
		},
	});

export const useDeleteDevice = () =>
	useMutation({
		mutationFn: async (deviceId: number) =>
			await fetchApi(`/device/${deviceId}`, 'DELETE'),
		onMutate: async (deviceIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices?.filter((device) => device.id !== deviceIdToDelete)
			);
			return previousDevices;
		},
		onSuccess: () => toast.success('Appareil supprimé avec succès'),
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
		onMutate: async () =>
			await queryClient.cancelQueries({ queryKey: ['devices'] }),
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
