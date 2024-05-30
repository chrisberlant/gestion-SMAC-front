import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	UserCreationType,
	UserInfosAndPasswordType,
	UserType,
	UserUpdateType,
} from '@customTypes/user';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';

// Récupérer tous les utilisateurs
export const useGetAllUsers = () =>
	useQuery({
		queryKey: ['users'],
		queryFn: async () => (await fetchApi('/users')) as UserType[],
	});

// Créer un utilisateur
export const useCreateUser = (
	openConfirmationModal: (user: UserInfosAndPasswordType) => void
) =>
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
			openConfirmationModal({
				fullName: `${newUser.user.firstName} ${newUser.user.lastName}`,
				email: newUser.user.email,
				generatedPassword: newUser.generatedPassword,
			});
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
	openConfirmationModal: (user: UserInfosAndPasswordType) => void
) =>
	useMutation({
		mutationFn: async (userId: number) =>
			await fetchApi(`/user/password/${userId}`, 'PATCH'),
		onSuccess: (user: UserInfosAndPasswordType) =>
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
