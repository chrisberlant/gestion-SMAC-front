/* eslint-disable no-mixed-spaces-and-tabs */
import { UseFormReturnType } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
	CurrentUserPasswordUpdateType,
	CurrentUserUpdateType,
	LoggedUser,
	UserCreationType,
	UserDeletionType,
	UserLoginType,
	UserPasswordIsResetType,
	UserType,
	UserUpdateType,
} from '../types/user';
import fetchApi from './fetchApi';
import queryClient from './queryClient';
import { IdSelectionType } from '../types';

// Connexion
export const useLogin = (
	form: UseFormReturnType<UserLoginType>,
	toggleOverlay: () => void
) => {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			return (await fetchApi('/login', 'POST', form.values)) as {
				loggedUser: LoggedUser;
				smac_token: string;
			};
		},
		onSuccess: (user) => {
			queryClient.setQueryData(['currentUser'], user.loggedUser);
			localStorage.setItem('smac_token', user.smac_token);
			toast.info(`Bienvenue, ${user!.loggedUser.firstName} !`);
			navigate('/devices');
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
			return await fetchApi('/logout');
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
			return (await fetchApi('/getCurrentUser')) as LoggedUser;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

// Vérifier si l'utilisateur a déjà un token lorsqu'il est sur la page de connexion
export const useCheckLoginStatus = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			return (await fetchApi('/getCurrentUser')) as LoggedUser;
		},
		meta: {
			loginStatusQuery: 'true',
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

// Modifier les infos utilisateur actuel
export const useUpdateCurrentUser = (
	form: UseFormReturnType<CurrentUserUpdateType>,
	toggleOverlay: () => void,
	closeAccountModal: () => void
) => {
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			return (await fetchApi(
				'/updateCurrentUser',
				'PATCH',
				form.values
			)) as LoggedUser;
		},
		onSuccess: (newCurrentUser) => {
			closeAccountModal();
			queryClient.setQueryData(
				['currentUser'],
				(currentUser: LoggedUser) => ({
					...currentUser,
					firstName: newCurrentUser?.firstName,
					lastName: newCurrentUser?.lastName,
					email: newCurrentUser?.email,
				})
			);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((user) =>
					user.email === newCurrentUser?.email
						? {
								...user,
								firstName: newCurrentUser?.firstName,
								lastName: newCurrentUser?.lastName,
								email: newCurrentUser?.email,
						  }
						: user
				)
			);
			toast.success('Informations modifiées avec succès');
		},
		onSettled: () => {
			toggleOverlay();
		},
	});
};

// Modifier le mot de passe utilisateur actuel
export const useUpdateCurrentUserPassword = (
	form: UseFormReturnType<CurrentUserPasswordUpdateType>,
	toggleOverlay: () => void,
	closePasswordModal: () => void,
	closeAccountModal: () => void
) => {
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			await fetchApi('/updateCurrentUserPassword', 'PATCH', form.values);
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
			}, 2000);
		},
		onError: () => {
			form.setErrors({ oldPassword: ' ' });
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
		mutationFn: async (user: UserCreationType) => {
			return await fetchApi('/createUser', 'POST', user);
		},

		onMutate: async (newUser) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) => [
				...users,
				{
					...newUser,
				},
			]);
			return previousUsers;
		},
		onSuccess: (newUser: { user: UserType; generatedPassword: string }) => {
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((user) =>
					user.email === newUser.user.email
						? { ...user, id: newUser.user.id }
						: user
				)
			);
			toast.success('Utilisateur créé avec succès');
		},
		onError: (_, __, previousUsers) =>
			queryClient.setQueryData(['users'], previousUsers),
	});
};

export const useUpdateUser = () => {
	return useMutation({
		mutationFn: async (user: UserUpdateType) => {
			return await fetchApi('/updateUser', 'PATCH', user);
		},

		onMutate: async (updatedUser) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((prevUser) =>
					prevUser.id === updatedUser.id ? updatedUser : prevUser
				)
			);
			return previousUsers;
		},
		onSuccess: () => toast.success('Utilisateur modifié avec succès'),
		onError: (_, __, previousUsers) =>
			queryClient.setQueryData(['users'], previousUsers),
	});
};

export const useResetPassword = (
	openConfirmationModal: (user: UserPasswordIsResetType) => void
) => {
	return useMutation({
		mutationFn: async (user: IdSelectionType) => {
			return await fetchApi('/resetPassword', 'PATCH', user);
		},

		onSuccess: (user: UserPasswordIsResetType) =>
			openConfirmationModal(user),
	});
};

export const useDeleteUser = () => {
	return useMutation({
		mutationFn: async (user: UserDeletionType) => {
			return await fetchApi('/deleteUser', 'DELETE', user);
		},

		onMutate: async (userToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.filter((user: UserType) => user.id !== userToDelete.id)
			);
			return previousUsers;
		},
		onSuccess: () => toast.success('Utilisateur supprimé avec succès'),
		onError: (_, __, previousUsers) =>
			queryClient.setQueryData(['users'], previousUsers),
	});
};
