import { useQuery } from '@tanstack/react-query';
import { LoggedUser, UserType } from '../@types/types';
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
