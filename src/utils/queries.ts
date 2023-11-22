import { useQuery } from '@tanstack/react-query';
import { AdminDashboardDataType } from '../@types/types';
import fetchApi from './fetchApi';

export const useGetAdminDashboard = () => {
	return useQuery({
		queryKey: ['adminDashboard'],
		queryFn: async () => {
			const data: AdminDashboardDataType = await fetchApi(
				'/getAdminDashboard'
			);
			return data;
		},
	});
};
