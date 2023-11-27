import { useQuery } from '@tanstack/react-query';
import {
	ModelType,
	ServiceType,
	LoggedUser,
	UserType,
	DeviceType,
} from '../@types/types';
import fetchApi from './fetchApi';

export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const data: LoggedUser = await fetchApi('/getCurrentUser');
			return data;
		},
		retry: false,
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

export const useGetAllDevices = () => {
	return useQuery({
		queryKey: ['devices'],
		queryFn: async () => {
			const data: DeviceType[] = await fetchApi('/getAllDevices');
			return data;
		},
		retry: false,
	});
};
