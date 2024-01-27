import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AgentType } from '../types';
import fetchApi from './fetchApi';
import queryClient from './queryClient';

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
		mutationFn: async (agent: AgentType) => {
			return await fetchApi('/createAgent', 'POST', agent);
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
		onSuccess: (newAgent: AgentType) => {
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
		mutationFn: async (agent: AgentType) => {
			return await fetchApi('/updateAgent', 'PATCH', agent);
		},

		onMutate: async (updatedAgent) => {
			await queryClient.cancelQueries({ queryKey: ['agents'] });
			const previousAgents = queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
				agents.map((prevAgent) =>
					prevAgent.id === updatedAgent.id ? updatedAgent : prevAgent
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
		mutationFn: async (agent: { id: number }) => {
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
