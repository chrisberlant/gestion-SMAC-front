import { UseFormReturnType } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
	UserLoginType,
	LoggedUserType,
	CurrentUserUpdateType,
	UserInfosWithoutRoleType,
	UserType,
	CurrentUserPasswordUpdateType,
	UserCredentialsType,
} from '@customTypes/user';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';

// Utilisé uniquement pour la démo
export const useResetDbAndCreateDemoUser = (
	setDemoUserInfos: React.Dispatch<
		React.SetStateAction<{
			email: string;
			password: string;
		} | null>
	>
) =>
	useMutation({
		mutationFn: async () =>
			(await fetchApi('/demo', 'POST')) as UserCredentialsType,
		onSuccess: (createdDemoUser) => {
			toast.success('Initialisation de la version de démo effectuée !');
			setDemoUserInfos({
				email: createdDemoUser.email,
				password: createdDemoUser.password,
			});
		},
	});

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
		queryFn: async () => (await fetchApi('/me')) as LoggedUserType,
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
	closeModal: () => void
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
			const { id: currentUserId, ...updatedInfos } = updatedCurrentUser;
			queryClient.setQueryData(
				['currentUser'],
				(currentUser: LoggedUserType) => ({
					...updatedInfos,
					role: currentUser.role,
				})
			);
			// Si les utilisateurs sont en cache, mise à jour
			if (queryClient.getQueryData(['users'])) {
				queryClient.setQueryData(['users'], (users: UserType[]) =>
					users.map((user) =>
						user.id === currentUserId
							? {
									role: user.role,
									...updatedCurrentUser,
							  }
							: user
					)
				);
			}
			closeModal();
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
		onError: () => form.setErrors({ oldPassword: ' ' }),
		onSettled: () => toggleOverlay(),
	});