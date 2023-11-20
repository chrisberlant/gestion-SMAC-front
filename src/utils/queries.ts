import { useQuery } from '@tanstack/react-query';
import fetchApi from './fetchApi';

export const useGetAdminDashboard = () => {
	return useQuery({
		queryKey: ['adminDashboard'],
		queryFn: async () => {
			const data = await fetchApi('getAdminDashboard');
			return data;
		},
	});
};
