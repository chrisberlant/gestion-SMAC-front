import { useMutation, useQuery } from '@tanstack/react-query';
import { ServiceType, ServiceCreationType } from '@/types/service';
import fetchApi from '@/utils/fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllServices = () =>
	useQuery({
		queryKey: ['services'],
		queryFn: async () => (await fetchApi('/services')) as ServiceType[],
	});

export const useCreateService = () =>
	useMutation({
		mutationFn: async (service: ServiceCreationType) =>
			await fetchApi('/service', 'POST', service),
		onMutate: async (newService) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			const previousServices = queryClient.getQueryData(['services']);
			queryClient.setQueryData(
				['services'],
				(services: ServiceType[]) => [
					{
						...newService,
					},
					...services,
				]
			);
			return previousServices;
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
		onError: (_, __, previousServices) =>
			queryClient.setQueryData(['services'], previousServices),
	});

export const useUpdateService = () =>
	useMutation({
		mutationFn: async (service: ServiceType) => {
			const { id, ...title } = service;
			return await fetchApi(`/service/${id}`, 'PATCH', title);
		},
		onMutate: async (updatedService) => {
			await queryClient.cancelQueries({ queryKey: ['services'] });
			// Sauvegarde des services actuels
			const previousServices = queryClient.getQueryData(['services']);
			// Mise à jour du cache avant l'appel API pour màj instantée de l'UI
			queryClient.setQueryData(['services'], (services: ServiceType[]) =>
				services.map((service) =>
					service.id === updatedService.id
						? { ...updatedService }
						: service
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
			return previousServices;
		},
		onSuccess: () => toast.success('Service supprimé avec succès'),
		onError: (_, __, previousServices) =>
			queryClient.setQueryData(['services'], previousServices),
	});
