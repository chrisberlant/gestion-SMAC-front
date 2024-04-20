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
	UserLoginType,
	UserPasswordIsResetType,
	UserType,
	UserUpdateType,
} from '@customTypes/user';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';

// Connexion
export const useLogin = (
	form: UseFormReturnType<UserLoginType>,
	toggleOverlay: () => void
) =>
	useMutation({
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

// Récupérer les infos utilisateur
export const useGetCurrentUser = () =>
	useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			return (await fetchApi('/me')) as LoggedUserType;
		},
		gcTime: Infinity,
	});

// Vérifier si l'utilisateur a déjà un token lorsqu'il est sur la page de connexion
export const useCheckLoginStatus = () =>
	useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => (await fetchApi('/me')) as LoggedUserType,
		meta: {
			loginStatusQuery: 'true',
		},
		gcTime: Infinity,
	});

// Modifier les infos utilisateur actuel
export const useUpdateCurrentUser = (
	toggleOverlay: () => void,
	closeAccountModal: () => void
) =>
	useMutation({
		mutationFn: async (data: CurrentUserUpdateType) => {
			toggleOverlay();
			return (await fetchApi(
				'/me',
				'PATCH',
				data
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
			// Si les utilisateurs sont en cache, mise à jour
			if (queryClient.getQueryData(['users'])) {
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
			}
			toast.success('Informations modifiées avec succès');
		},
		onSettled: () => {
			toggleOverlay();
		},
	});

// Modifier le mot de passe utilisateur actuel
export const useUpdateCurrentUserPassword = (
	form: UseFormReturnType<CurrentUserPasswordUpdateType>,
	toggleOverlay: () => void,
	closePasswordModal: () => void
) =>
	useMutation({
		mutationFn: async () => {
			toggleOverlay();
			return await fetchApi('/my-password', 'PATCH', form.values);
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

// Récupérer tous les utilisateurs
export const useGetAllUsers = () =>
	useQuery({
		queryKey: ['users'],
		queryFn: async () => (await fetchApi('/users')) as UserType[],
	});

// Créer un utilisateur
export const useCreateUser = () =>
	useMutation({
		mutationFn: async (user: UserCreationType) =>
			await fetchApi('/user', 'POST', user),
		onMutate: async (newUser) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) => [
				...users,
				{
					...newUser,
					email: newUser.email,
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

// Mettre à jour un utilisateur
export const useUpdateUser = () =>
	useMutation({
		mutationFn: async (user: UserUpdateType) => {
			const { id, ...infos } = user;
			return await fetchApi(`/user/${id}`, 'PATCH', infos);
		},
		onMutate: async (updatedUser) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.map((prevUser) =>
					prevUser.id === updatedUser.id
						? { ...prevUser, ...updatedUser }
						: prevUser
				)
			);
			return previousUsers;
		},
		onSuccess: () => toast.success('Utilisateur modifié avec succès'),
		onError: (_, __, previousUsers) =>
			queryClient.setQueryData(['users'], previousUsers),
	});

// Réinitialiser le mot de passe d'un utilisateur
export const useResetPassword = (
	openConfirmationModal: (user: UserPasswordIsResetType) => void
) =>
	useMutation({
		mutationFn: async (userId: number) => {
			return await fetchApi(`/user/password/${userId}`, 'PATCH');
		},
		onSuccess: (user: UserPasswordIsResetType) =>
			openConfirmationModal(user),
	});

// Supprimer un utilisateur
export const useDeleteUser = () =>
	useMutation({
		mutationFn: async (userId: number) =>
			await fetchApi(`/user/${userId}`, 'DELETE'),
		onMutate: async (userIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['users'] });
			const previousUsers = queryClient.getQueryData(['users']);
			queryClient.setQueryData(['users'], (users: UserType[]) =>
				users.filter((user: UserType) => user.id !== userIdToDelete)
			);
			return previousUsers;
		},
		onSuccess: () => toast.success('Utilisateur supprimé avec succès'),
		onError: (_, __, previousUsers) =>
			queryClient.setQueryData(['users'], previousUsers),
	});
