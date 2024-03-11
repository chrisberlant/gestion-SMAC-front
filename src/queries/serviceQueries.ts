import { useMutation, useQuery } from '@tanstack/react-query';
import { IdSelectionType } from '../types';
import {
	ServiceType,
	ServiceCreationType,
	ServiceUpdateType,
} from '../types/service';
import fetchApi from '../utils/fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			return (await fetchApi('/getAllServices')) as ServiceType[];
		},
	});
};

export const useCreateService = () => {
	return useMutation({
		mutationFn: async (service: ServiceCreationType) => {
			return (await fetchApi(
				'/createService',
				'POST',
				service
			)) as ServiceType;
		},

		onMutate: async (newService) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			const previousServices = queryClient.getQueryData(['services']);
			queryClient.setQueryData(
				['services'],
				(services: ServiceType[]) => [
					...services,
					{
						...newService,
					},
				]
			);
			return previousServices;
		},
		onSuccess: (newService) => {
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services.map((service) =>
					service.title === newService.title
						? { ...service, id: newService.id }
						: service
				)
			);
			toast.success('Service créé avec succès');
		},
		onError: (_, __, previousServices) =>
			queryClient.setQueryData(['services'], previousServices),
	});
};

export const useUpdateService = () => {
	return useMutation({
		mutationFn: async (service: ServiceUpdateType) => {
			return (await fetchApi(
				'/updateService',
				'PUT',
				service
			)) as ServiceType;
		},

		onMutate: async (updatedService) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			// Sauvegarde des services actuels
			const previousServices = queryClient.getQueryData(['services']);
			// Mise à jour du cache avant l'appel API pour màj instantée de l'UI
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services.map((service) =>
					service.id === updatedService.id ? updatedService : service
				)
			);
			return previousServices;
		},
		onSuccess: () => toast.success('Service modifié avec succès'),
		onError: (_, __, previousServices) =>
			// Si erreur, rollback du cache
			queryClient.setQueryData(['services'], previousServices),
	});
};

export const useDeleteService = () => {
	return useMutation({
		mutationFn: async (service: IdSelectionType) => {
			return await fetchApi('/deleteService', 'DELETE', service);
		},

		onMutate: async (serviceToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			const previousServices = queryClient.getQueryData(['services']);
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services?.filter(
					(service: ServiceType) => service.id !== serviceToDelete.id
				)
			);
			return previousServices;
		},
		onSuccess: () => toast.success('Service supprimé avec succès'),
		onError: (_, __, previousServices) =>
			queryClient.setQueryData(['services'], previousServices),
	});
};