import { useMutation, useQuery } from '@tanstack/react-query';
import { ServiceType } from '../types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllServices = () => {
	return useQuery({
		queryKey: ['services'],
		queryFn: async () => {
			const data: ServiceType[] = await fetchApi('/getAllServices');
			return data;
		},
		retry: false,
	});
};

export const useUpdateService = () => {
	return useMutation({
		mutationFn: async (service: ServiceType) => {
			const data: ServiceType = await fetchApi(
				'/updateService',
				'PATCH',
				service
			);
			return data;
		},
		onMutate: (newService: ServiceType) => {
			queryClient.setQueryData(
				['services'],
				(prevServices: ServiceType[]) =>
					prevServices?.map((prevService: ServiceType) =>
						prevService.id === newService.id
							? newService
							: prevService
					)
			);
		},

		onSuccess: () => {
			toast.success('Informations modifiées avec succès');
		},
	});
};
