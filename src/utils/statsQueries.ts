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
			return (await fetchApi(
				'/getAgentsAndDevicesPerService'
			)) as AgentsAndDevicesPerServiceType[];
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
			return (await fetchApi(
				'/getDevicesAmountPerModel'
			)) as DevicesAmountPerModelType[][];
		},
		staleTime: Infinity,
		gcTime: Infinity,
	});
};
