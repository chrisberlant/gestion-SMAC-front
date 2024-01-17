import { useQuery } from '@tanstack/react-query';
import { DeviceType } from '../types';
import fetchApi from './fetchApi';

export const useGetAllDevices = () => {
	return useQuery({
		queryKey: ['devices'],
		queryFn: async () => {
			const data: DeviceType[] = await fetchApi('/getAllDevices');
			return data;
		},
	});
};
