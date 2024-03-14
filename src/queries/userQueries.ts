/* eslint-disable no-mixed-spaces-and-tabs */
import { UseFormReturnType } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	UserInfosWithoutRoleType,
	CurrentUserPasswordUpdateType,
	CurrentUserUpdateType,
	LoggedUserType,
	UserCreationType,
	UserDeletionType,
	UserLoginType,
	UserPasswordIsResetType,
	UserType,
	UserUpdateType,
} from '../types/user';
import fetchApi from '../utils/fetchApi';
import queryClient from './queryClient';
import { IdSelectionType } from '../types';

// Connexion
export const useLogin = (
	form: UseFormReturnType<UserLoginType>,
	toggleOverlay: () => void
) => {
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			return (await fetchApi('/login', 'POST', form.values)) as {
				loggedUser: LoggedUserType;
				smac_token: string;
			};
		},
		onSuccess: (user) => {
			queryClient.setQueryData(['currentUser'], user.loggedUser);
			localStorage.setItem('smac_token', user.smac_token);
			toast.info(`Bienvenue, ${user!.loggedUser.firstName} !`);
		},
		onError: () => {
			toggleOverlay();
			form.setFieldValue('password', '');
			form.setErrors({ email: ' ', password: ' ' });
		},
	});
};

// Récupérer les infos utilisateur
export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			return (await fetchApi('/getCurrentUser')) as LoggedUserType;
		},
		gcTime: Infinity,
	});
};

// Vérifier si l'utilisateur a déjà un token lorsqu'il est sur la page de connexion
export const useCheckLoginStatus = () => {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			return (await fetchApi('/getCurrentUser')) as LoggedUserType;
		},
		meta: {
			loginStatusQuery: 'true',
		},
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
			)) as UserInfosWithoutRoleType;
		},
		onSuccess: (updatedCurrentUser) => {
			closeAccountModal();
			queryClient.setQueryData(
				['currentUser'],
				(currentUser: LoggedUserType) => ({
					...currentUser,
					firstName: updatedCurrentUser?.firstName,
					lastName: updatedCurrentUser?.lastName,
					email: updatedCurrentUser?.email,
				})
			);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((user) =>
					user.id === updatedCurrentUser?.id
						? {
								...user,
								firstName: updatedCurrentUser?.firstName,
								lastName: updatedCurrentUser?.lastName,
								email: updatedCurrentUser?.email,
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
	closePasswordModal: () => void
) => {
	return useMutation({
		mutationFn: async () => {
			toggleOverlay();
			await fetchApi('/updateCurrentUserPassword', 'PATCH', form.values);
		},
		onSuccess: async () => {
			closePasswordModal();
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
			toast.success(
				'Mot de passe modifié avec succès, vous allez être redirigé vers la page de connexion'
			);
			localStorage.removeItem('smac_token');
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
					email: newUser.email.toLowerCase(),
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
