import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DeviceType } from '../types';
import fetchApi from './fetchApi';
import queryClient from './queryClient';

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
		mutationFn: async (device: DeviceType) => {
			return (await fetchApi(
				'/createDevice',
				'POST',
				device
			)) as DeviceType;
		},

		onMutate: async (newDevice: DeviceType) => {
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
		onSuccess: (newDevice: DeviceType) => {
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
		mutationFn: async (device: DeviceType) => {
			return (await fetchApi(
				'/updateDevice',
				'PATCH',
				device
			)) as DeviceType;
		},

		onMutate: async (newDevice: DeviceType) => {
			await queryClient.cancelQueries({ queryKey: ['devices'] });
			const previousDevices = queryClient.getQueryData(['devices']);
			queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
				devices.map((prevDevice) =>
					prevDevice.id === newDevice.id ? newDevice : prevDevice
				)
			);
			return previousDevices;
		},
		onSuccess: () => toast.success('Appareil modifié avec succès'),
		onError: (_, __, previousDevices) =>
			queryClient.setQueryData(['devices'], previousDevices),
	});
};
