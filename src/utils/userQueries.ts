import { useMutation, useQuery } from '@tanstack/react-query';
import { LoggedUser, UserType } from '../types';
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

// Modifier les infos utilisateur actuel
export const useUpdateCurrentUser = (
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
				'/updateCurrentUser',
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
export const useUpdateCurrentUserPassword = (
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
				'/updateCurrentUserPassword',
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

// Récupérer tous les utilisateurs
export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			return (await fetchApi('/getAllUsers')) as UserType[];
		},
	});
};

export const useCreateUser = () => {
	return useMutation({
		mutationFn: async (user: UserType) => {
			return (await fetchApi('/createUser', 'POST', user)) as {
				generatedPassword: string;
				user: UserType;
			};
		},

		onMutate: async (newUser: UserType) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) => [
				...users,
				{
					...newUser,
				},
			]);
			return { previousUsers };
		},
		onSuccess: (newUser: { generatedPassword: string; user: UserType }) => {
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((user) =>
					user.email === newUser.user.email
						? { ...user, id: newUser.user.id }
						: user
				)
			);
			toast.success('Utilisateur créé avec succès');
		},
		onError: (_, __, context) =>
			queryClient.setQueryData(['users'], context?.previousUsers),
	});
};

export const useUpdateUser = () => {
	return useMutation({
		mutationFn: async (user: UserType) => {
			return (await fetchApi('/updateUser', 'PATCH', user)) as UserType;
		},

		onMutate: async (newUser: UserType) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((prevUser) =>
					prevUser.id === newUser.id ? newUser : prevUser
				)
			);
			return { previousUsers };
		},
		onSuccess: () => toast.success('Utilisateur modifié avec succès'),
		onError: (_, __, context) =>
			queryClient.setQueryData(['users'], context?.previousUsers),
	});
};

export const useDeleteUser = () => {
	return useMutation({
		mutationFn: async (user: { id: number }) => {
			return (await fetchApi('/deleteUser', 'DELETE', user)) as UserType;
		},

		onMutate: async (userToDelete: { id: number }) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users?.filter((user: UserType) => user.id !== userToDelete.id)
			);
			return { previousUsers };
		},
		onSuccess: () => toast.success('Utilisateur supprimé avec succès'),
		onError: (_, __, context) =>
			queryClient.setQueryData(['users'], context?.previousUsers),
	});
};
