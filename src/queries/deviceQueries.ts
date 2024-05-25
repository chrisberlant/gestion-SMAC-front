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
import displayErrorOnImportModal from '@modals/errorOnImportModal';
import { isJson } from '../utils';

export const useGetAllDevices = () =>
	useQuery({
		queryKey: ['devices'],
		queryFn: async () => (await fetchApi('/devices')) as DeviceType[],
	});

// Créer un appareil, en cas de création via ajout rapide, la gestion de la modale est ajoutée
export const useCreateDevice = () =>
	useMutation({
		mutationFn: async (device: DeviceCreationType) =>
			(await fetchApi('/device', 'POST', device)) as DeviceType,
		onMutate: async (newDevice) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) => [
				{
					...newDevice,
				},
				...devices,
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

// Ajout rapide d'un appareil via modale, ajout de la gestion du overlay et fermeture de la modale
export const useQuickCreateDevice = (
	toggleOverlay: () => void,
	closeQuickAddModal: () => void
) =>
	useMutation({
		mutationFn: async (device: DeviceCreationType) => {
			toggleOverlay();
			return (await fetchApi('/device', 'POST', device)) as DeviceType;
		},
		onSuccess: (newDevice) => {
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) => [
				{
					...newDevice,
				},
				...devices,
			]);
			toast.success('Appareil créé avec succès');
		},
		onSettled: () => {
			toggleOverlay();
			closeQuickAddModal();
		},
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
		// Rollback des données
		onError: (_, __, previousDevices) =>
			queryClient.setQueryData(['devices'], previousDevices),
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
			if (!isJson(error.message)) return toast.error(error.message);

			const errors = JSON.parse(error.message);
			// Création d'un nouvel objet afin d'afficher un message personnalisé dans la modale qui sera appelée
			const formatedErrors: {
				message: string;
				values: string[];
			}[] = [];

			if (errors.usedDevices.length > 0)
				formatedErrors.push({
					message: 'Les appareils suivants sont déjà existants :',
					values: errors.usedDevices,
				});

			if (errors.unknownModels.length > 0)
				formatedErrors.push({
					message:
						"Les modèles d'appareil suivants sont introuvables :",
					values: errors.unknownModels,
				});

			if (errors.unknownAgents.length > 0)
				formatedErrors.push({
					message: 'Les agents suivants sont introuvables :',
					values: errors.unknownAgents,
				});

			if (formatedErrors.length > 0)
				return displayErrorOnImportModal(formatedErrors);

			// Si Zod renvoie un message indiquant un problème dans le format du CSV
			return toast.error('Format du CSV incorrect');
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
