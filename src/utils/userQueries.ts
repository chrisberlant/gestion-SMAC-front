import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoggedUser, UserType } from '../@types/types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import { UseFormReturnType } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

export const useLogin = (
	form: UseFormReturnType<{
		email: string;
		password: string;
	}>
) => {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async () => {
			const user: LoggedUser = await fetchApi(
				'/login',
				'POST',
				form.values
			);
			return user;
		},
		onSuccess: (user) => {
			toast.info(`Bienvenue, ${user!.firstName} !`);
			navigate('/attributed-lines');
		},
		onError: () => {
			form.setFieldValue('password', '');
			form.setErrors({ email: ' ', password: ' ' });
		},
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async () => {
			await fetchApi('/logout');
		},
		onSuccess: () => {
			toast.info(
				'Vous avez été déconnecté, vous allez être redirigé vers la page de connexion'
			);
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			setTimeout(() => {
				window.location.href = '/';
			}, 3000);
		},
		onError: () => {
			toast.error('Impossible de vous déconnecter');
		},
	});
};

export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const currentUser: LoggedUser = await fetchApi('/getCurrentUser');
			return currentUser;
		},
		meta: {
			loginQuery: 'true',
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
			const users: UserType[] = await fetchApi('/getAllUsers');
			return users;
		},
		retry: false,
	});
};
