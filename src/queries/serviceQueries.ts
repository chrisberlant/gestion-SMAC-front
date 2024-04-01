import { useMutation, useQuery } from '@tanstack/react-query';
import { ServiceType, ServiceCreationType } from '@customTypes/service';
import fetchApi from '@utils/fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			return (await fetchApi('/services')) as ServiceType[];
		},
	});
};

export const useCreateService = () => {
	return useMutation({
		mutationFn: async (service: ServiceCreationType) => {
			return (await fetchApi('/service', 'POST', service)) as ServiceType;
		},
		onMutate: async (newService) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			const previousServices: ServiceType[] | undefined =
				queryClient.getQueryData(['services']);
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
			queryClient.setQueryData(
				['services'],
				(services: ServiceType[] | undefined) =>
					services?.map((service) =>
						service.title === newService.title
							? { ...service, id: newService.id }
							: service
					)
			);
			toast.success('Service créé avec succès');
		},
		onError: (_, __, previousServices) => {
			if (previousServices)
				queryClient.setQueryData(['services'], previousServices);
		},
	});
};

export const useUpdateService = () =>
	useMutation({
		mutationFn: async (service: ServiceType) => {
			const { id, ...title } = service;
			return (await fetchApi(
				`/service/${id}`,
				'PATCH',
				title
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

export const useDeleteService = () =>
	useMutation({
		mutationFn: async (serviceId: number) =>
			await fetchApi(`/service/${serviceId}`, 'DELETE'),
		onMutate: async (serviceIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			const previousServices = queryClient.getQueryData(['services']);
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services?.filter(
					(service: ServiceType) => service.id !== serviceIdToDelete
				)
			);
			return previousServices as ServiceType[] | [];
		},
		onSuccess: () => toast.success('Service supprimé avec succès'),
		onError: (_, __, previousServices) =>
			queryClient.setQueryData(['services'], previousServices),
	});
