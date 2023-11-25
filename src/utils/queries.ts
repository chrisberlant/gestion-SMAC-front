import { useQuery } from '@tanstack/react-query';
import {
	ModelType,
	ServiceType,
	UserInterface,
	UserType,
} from '../@types/types';
import fetchApi from './fetchApi';

export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const data: UserInterface = await fetchApi('/getCurrentUser');
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const data: UserType[] = await fetchApi('/getAllUsers');
			return data;
		},
		retry: false,
	});
};

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
