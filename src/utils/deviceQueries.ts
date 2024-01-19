import { useQuery } from '@tanstack/react-query';
import { DeviceType } from '../types';
import fetchApi from './fetchApi';

export const useGetAllDevices = () => {
	return useQuery({
		queryKey: ['devices'],
		queryFn: async () => {
			return (await fetchApi('/getAllDevices')) as DeviceType[];
		},
	});
};
