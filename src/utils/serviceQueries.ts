import { useMutation, useQuery } from '@tanstack/react-query';
import { ServiceType } from '../types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			return (await fetchApi('/getAllServices')) as ServiceType[];
		},
		retry: false,
	});
};

export const useCreateService = () => {
	return useMutation({
		mutationFn: async (service: ServiceType) => {
			return (await fetchApi(
				'/createService',
				'POST',
				service
			)) as ServiceType;
		},

		onMutate: async (newService: ServiceType) => {
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
			return { previousServices };
		},

		onSuccess: (newService: ServiceType) => {
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services.map((service) =>
					service.title === newService.title
						? { ...service, id: newService.id }
						: service
				)
			);
			toast.success('Service créé avec succès');
		},
		onError: (_, __, context) =>
			queryClient.setQueryData(['services'], context?.previousServices),
	});
};

export const useUpdateService = () => {
	return useMutation({
		mutationFn: async (service: ServiceType) => {
			return (await fetchApi(
				'/updateService',
				'PUT',
				service
			)) as ServiceType;
		},

		onMutate: async (newService: ServiceType) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			// Sauvegarde des services actuels
			const previousServices = queryClient.getQueryData(['services']);
			// Mise à jour du cache avant l'appel API pour màj instantée de l'UI
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services.map((prevService) =>
					prevService.id === newService.id ? newService : prevService
				)
			);
			return { previousServices };
		},
		onSuccess: () => toast.success('Service modifié avec succès'),
		onError: (_, __, context) =>
			// Si erreur, rollback du cache
			queryClient.setQueryData(['services'], context?.previousServices),
	});
};

export const useDeleteService = () => {
	return useMutation({
		mutationFn: async (service: { id: number }) => {
			return (await fetchApi(
				'/deleteService',
				'DELETE',
				service
			)) as ServiceType;
		},

		onMutate: async (serviceToDelete: { id: number }) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			const previousServices = queryClient.getQueryData(['services']);
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services?.filter(
					(service: ServiceType) => service.id !== serviceToDelete.id
				)
			);
			return { previousServices };
		},
		onSuccess: () => toast.success('Service supprimé avec succès'),
		onError: (_, __, context) =>
			queryClient.setQueryData(['services'], context?.previousServices),
	});
};
