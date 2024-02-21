import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	DeviceType,
	DeviceCreationType,
	DeviceUpdateType,
} from '../types/device';
import fetchApi from './fetchApi';
import queryClient from './queryClient';
import { IdSelectionType } from '../types';
import { LineType } from '../types/line';
import { useUpdateLine } from './lineQueries';

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
			// et que les lignes sont en cache
			if (updatedDevice.updateLine && previousLines) {
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
		mutationFn: async (device: IdSelectionType) => {
			return (await fetchApi(
				'/deleteDevice',
				'DELETE',
				device
			)) as DeviceType;
		},

		onMutate: async (deviceToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices?.filter((device) => device.id !== deviceToDelete.id)
			);
			return previousDevices;
		},
		onSuccess: () => toast.success('Appareil supprimé avec succès'),
		onError: (_, __, previousDevices) =>
			queryClient.setQueryData(['devices'], previousDevices),
	});
};
