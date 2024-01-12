import fetchApi from './fetchApi';
import { useQuery } from '@tanstack/react-query';
import {
	AgentsAndDevicesPerServiceType,
	DevicesAmountPerModelType,
} from '../types';

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
			const data: DevicesAmountPerModelType[] = await fetchApi(
				'/getDevicesAmountPerModel'
			);
			return data;
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
