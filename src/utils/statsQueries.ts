import fetchApi from './fetchApi';
import { useQuery } from '@tanstack/react-query';
import queryClient from './queryClient';
import { AgentsAndDevicesPerServiceType } from '../@types/types';

// Nombre d'agents et d'appareils par service
export const useGetAgentsAndDevicesPerService = () => {
	return useQuery({
		queryKey: ['agentsAndDevicesPerService'],
		queryFn: async () => {
			const data: AgentsAndDevicesPerServiceType[] = await fetchApi(
				'/getAgentsAndDevicesPerService'
			);
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};

// Nombre d'appareils par modèle
export const useGetDevicesAmountPerModel = () => {
	return useQuery({
		queryKey: ['devicesAmountPerModel'],
		queryFn: async () => {
			const data = await fetchApi('/getDevicesAmountPerModel');
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
