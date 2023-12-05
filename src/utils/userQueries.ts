import { useMutation, useQuery } from '@tanstack/react-query';
import { LoggedUser, UserType } from '../@types/types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import { UseFormReturnType } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import queryClient from './queryClient';

// Connexion
export const useLogin = (
	form: UseFormReturnType<{
		email: string;
		password: string;
	}>,
	toggleOverlay: () => void
) => {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			const user: LoggedUser = await fetchApi(
				'/login',
				'POST',
				form.values
			);
			return user;
		},
		onSuccess: (user) => {
			queryClient.setQueryData(['currentUser'], user);
			toast.info(`Bienvenue, ${user!.firstName} !`);
			navigate('/attributed-lines');
		},
		onError: () => {
			toggleOverlay();
			form.setFieldValue('password', '');
			form.setErrors({ email: ' ', password: ' ' });
		},
	});
};

// Déconnexion
export const useLogout = () => {
	return useQuery({
		queryKey: ['logout'],
		queryFn: async () => {
			const data = await fetchApi('/logout');
			return data;
		},
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};

// Récupérer les infos utilisateur
export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const currentUser: LoggedUser = await fetchApi('/getCurrentUser');
			return currentUser;
		},
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

// Vérifier si l'utilisateur a déjà un token lorsqu'il est sur la page de connexion
export const useCheckLoginStatus = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const loggedUser: LoggedUser = await fetchApi('/getCurrentUser');
			return loggedUser;
		},
		meta: {
			loginStatusQuery: 'true',
		},
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

// Récupérer tous les utilisateurs
export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const users: UserType[] = await fetchApi('/getAllUsers');
			return users;
		},
	});
};

// Modifier les infos utilisateur actuel
export const useModifyCurrentUser = (
	form: UseFormReturnType<{
		email: string;
		lastName: string;
		firstName: string;
	}>,
	toggleOverlay: () => void,
	closeAccountModal: () => void
) => {
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			const data: LoggedUser = await fetchApi(
				'/modifyCurrentUser',
				'PATCH',
				form.values
			);
			return data;
		},
		onSuccess: (user) => {
			closeAccountModal();
			queryClient.setQueryData(['currentUser'], user);
			toast.success('Informations modifiées avec succès');
		},
		onSettled: () => {
			toggleOverlay();
		},
	});
};

// Modifier le mot de passe utilisateur actuel
export const useModifyCurrentUserPassword = (
	form: UseFormReturnType<{
		oldPassword: string;
		newPassword: string;
		confirmPassword: string;
	}>,
	toggleOverlay: () => void,
	closePasswordModal: () => void,
	closeAccountModal: () => void
) => {
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			const data: string = await fetchApi(
				'/modifyCurrentUserPassword',
				'PATCH',
				form.values
			);
			return data;
		},
		onSuccess: async () => {
			closePasswordModal();
			closeAccountModal();
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			toast.success(
				'Mot de passe modifié avec succès, vous allez être redirigé vers la page de connexion'
			);
			await fetchApi('/logout');
			setTimeout(() => {
				window.location.href = '/';
			}, 3000);
		},
		onSettled: () => {
			toggleOverlay();
		},
	});
};
