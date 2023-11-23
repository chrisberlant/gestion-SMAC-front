import { useQuery } from '@tanstack/react-query';
import {
	AdminDashboardDataType,
	ModelType,
	ServiceType,
	UserType,
} from '../@types/types';
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

export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const data: UserType[] = await fetchApi('/getAllUsers');
			return data;
		},
	});
};

export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const data: ServiceType[] = await fetchApi('/getAllServices');
			return data;
		},
	});
};

export const useGetAllModels = () => {
	return useQuery({
		queryKey: ['models'],
		queryFn: async () => {
			const data: ModelType[] = await fetchApi('/getAllModels');
			return data;
		},
	});
};
