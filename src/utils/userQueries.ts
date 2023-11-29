import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoggedUser, UserType } from '../@types/types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import { UseFormReturnType } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

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

// Récupérer les infos utilisateur
export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const currentUser: LoggedUser = await fetchApi('/getCurrentUser');
			return currentUser;
		},
		retry: false,
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

// Utilisé uniquement pour vérifier si l'utilisateur a déjà un token lorsqu'il est sur la page de connexion
export const useCheckLoginStatus = () => {
	return useQuery({
		queryKey: ['loginStatus'],
		queryFn: async () => {
			const loggedUser: LoggedUser = await fetchApi('/getCurrentUser');
			return loggedUser;
		},
		meta: {
			loginStatusQuery: 'true',
		},
		refetchOnWindowFocus: false,
		retry: false,
		staleTime: 0,
		gcTime: 0,
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
		retry: false,
	});
};
