import { useQuery } from '@tanstack/react-query';
import { ModelType } from '../@types/types';
import fetchApi from './fetchApi';

export const useGetAllModels = () => {
	return useQuery({
		queryKey: ['models'],
		queryFn: async () => {
			const data: ModelType[] = await fetchApi('/getAllModels');
			return data;
		},
		retry: false,
	});
};
