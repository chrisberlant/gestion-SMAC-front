import { useQuery } from '@tanstack/react-query';
import {
	AgentsAndDevicesPerServiceType,
	DevicesAmountPerModelType,
} from '../types';
import fetchApi from '@utils/fetchApi';

// Nombre d'appareils par modèle
export const useGetDevicesAmountPerModel = () =>
	useQuery({
		queryKey: ['devicesAmountPerModel'],
		queryFn: async () => {
			return (await fetchApi(
				'/stats/devices-per-model'
			)) as DevicesAmountPerModelType[];
		},
		staleTime: 0,
		gcTime: 0,
	});

// Nombre d'agents et d'appareils par service
export const useGetAgentsAndDevicesPerService = () =>
	useQuery({
		queryKey: ['agentsAndDevicesPerService'],
		queryFn: async () => {
			return (await fetchApi(
				'/stats/agents-devices-per-service'
			)) as AgentsAndDevicesPerServiceType[];
		},
		staleTime: 0,
		gcTime: 0,
	});
