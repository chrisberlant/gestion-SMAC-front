import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from './fetchApi';
import queryClient from './queryClient';
import { AgentCreationType, AgentType, AgentUpdateType } from '../types/agent';
import { IdSelectionType } from '../types';

// Récupérer tous les utilisateurs
export const useGetAllAgents = () => {
	return useQuery({
		queryKey: ['agents'],
		queryFn: async () => {
			return (await fetchApi('/getAllAgents')) as AgentType[];
		},
	});
};

export const useCreateAgent = () => {
	return useMutation({
		mutationFn: async (newAgent: AgentCreationType) => {
			return (await fetchApi(
				'/createAgent',
				'POST',
				newAgent
			)) as AgentType;
		},

		onMutate: async (newAgent) => {
			await queryClient.cancelQueries({ queryKey: ['agents'] });
			const previousAgents = queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['agents'], (agents: AgentType[]) => [
				...agents,
				{
					...newAgent,
				},
			]);
			return previousAgents;
		},
		onSuccess: (newAgent) => {
			queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
				agents.map((agent) =>
					agent.email.toLowerCase() === newAgent.email
						? { ...agent, id: newAgent.id }
						: agent
				)
			);
			toast.success('Agent créé avec succès');
		},
		onError: (_, __, previousAgents) =>
			queryClient.setQueryData(['agents'], previousAgents),
	});
};

export const useUpdateAgent = () => {
	return useMutation({
		mutationFn: async (agent: AgentUpdateType) => {
			return (await fetchApi(
				'/updateAgent',
				'PATCH',
				agent
			)) as AgentType;
		},

		onMutate: async (updatedAgent) => {
			await queryClient.cancelQueries({ queryKey: ['agents'] });
			const previousAgents = queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
				agents.map((agent) =>
					agent.id === updatedAgent.id
						? { ...updatedAgent, devices: agent.devices }
						: agent
				)
			);
			return previousAgents;
		},
		onSuccess: () => toast.success('Agent modifié avec succès'),
		onError: (_, __, previousAgents) =>
			queryClient.setQueryData(['agents'], previousAgents),
	});
};

export const useDeleteAgent = () => {
	return useMutation({
		mutationFn: async (agent: IdSelectionType) => {
			return await fetchApi('/deleteAgent', 'DELETE', agent);
		},

		onMutate: async (agentToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['agents'] });
			const previousAgents = queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
				agents.filter(
					(agent: AgentType) => agent.id !== agentToDelete.id
				)
			);
			return previousAgents;
		},
		onSuccess: () => toast.success('Agent supprimé avec succès'),
		onError: (_, __, previousAgents) =>
			queryClient.setQueryData(['agents'], previousAgents),
	});
};
