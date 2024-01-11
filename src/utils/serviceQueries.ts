import { useMutation, useQuery } from '@tanstack/react-query';
import { LoggedUser, ServiceType } from '../@types/types';
import fetchApi from './fetchApi';
import { UseFormReturnType } from '@mantine/form';
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

export const useModifyService = (
	form: UseFormReturnType<{
		id: string;
		title: string;
	}>
) => {
	return useMutation({
		mutationFn: async () => {
			const data: LoggedUser = await fetchApi(
				'/modifyService',
				'PATCH',
				form.values
			);
			return data;
		},
		onSuccess: (service) => {
			queryClient.setQueryData(['services'], service);
			toast.success('Informations modifiées avec succès');
		},
	});
};
