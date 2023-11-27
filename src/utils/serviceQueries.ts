import { useQuery } from '@tanstack/react-query';
import { ServiceType } from '../@types/types';
import fetchApi from './fetchApi';

export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const data: ServiceType[] = await fetchApi('/getAllServices');
			return data;
		},
		retry: false,
	});
};
