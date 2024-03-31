import { useQuery } from '@tanstack/react-query';
import fetchApi from '../utils/fetchApi';
import { HistoryType } from '../types/history';

export const useGetAllHistory = () => {
	return useQuery({
		queryKey: ['history'],
		queryFn: async () => {
			return (await fetchApi('/history')) as HistoryType[];
		},
	});
};
