import { useQuery } from '@tanstack/react-query';
import { ModelType } from '../@types/types';
import fetchApi from './fetchApi';

export const useGetAllActiveLines = () => {
	return useQuery({
		queryKey: ['activeLines'],
		queryFn: async () => {
			const data: ModelType[] = await fetchApi('/getAllLines/attributed');
			return data;
		},
		retry: false,
	});
};
