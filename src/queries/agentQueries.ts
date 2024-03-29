import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';
import {
	AgentCreationType,
	AgentType,
	AgentUpdateType,
} from '@customTypes/agent';
import displayAlreadyExistingValuesOnImportModal from '../modals/alreadyExistingValuesOnImportModal';

// Récupérer tous les agents
export const useGetAllAgents = () => {
	return useQuery({
		queryKey: ['agents'],
		queryFn: async () => {
			return (await fetchApi('/getAllAgents')) as AgentType[];
		},
	});
};

// Créer un agent
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
			const previousAgents: AgentType[] | undefined =
				queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['agents'], (agents: AgentType[]) => [
				...agents,
				{
					...newAgent,
					email: newAgent.email.toLowerCase(),
				},
			]);
			return previousAgents;
		},
		onSuccess: (newAgent) => {
			queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
				agents.map((agent) =>
					agent.email === newAgent.email
						? { ...agent, id: newAgent.id }
						: agent
				)
			);
			toast.success('Agent créé avec succès');
		},
		onError: (_, __, previousAgents) => {
			if (previousAgents)
				queryClient.setQueryData(['agents'], previousAgents);
		},
	});
};

// Mettre à jour un agent
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

// Supprimer un agent
export const useDeleteAgent = () => {
	return useMutation({
		mutationFn: async (agentId: number) => {
			return await fetchApi('/deleteAgent', 'DELETE', { id: agentId });
		},
		onMutate: async (agentIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['agents'] });
			const previousAgents = queryClient.getQueryData(['agents']);
			queryClient.setQueryData(['agents'], (agents: AgentType[]) =>
				agents.filter(
					(agent: AgentType) => agent.id !== agentIdToDelete
				)
			);
			return previousAgents;
		},
		onSuccess: () => toast.success('Agent supprimé avec succès'),
		onError: (_, __, previousAgents) =>
			queryClient.setQueryData(['agents'], previousAgents),
	});
};

// Exporter les agents en CSV
export const useExportAgentsToCsv = () => {
	return useQuery({
		queryKey: ['agentsCsv'],
		queryFn: async () => await fetchApi('/exportAgentsCsvFile'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};

// Créer des agents à partir d'un CSV
export const useImportMultipleAgents = (
	toggleOverlay: () => void,
	closeImportModal: () => void
) => {
	return useMutation({
		mutationFn: async (importedAgents: object[]) => {
			toggleOverlay();
			return await fetchApi(
				'/importMultipleAgents',
				'POST',
				importedAgents
			);
		},
		meta: {
			importMutation: 'true',
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['agents'] });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['agents'] });
			toast.success('Agents importés avec succès');
		},
		onError: (error) => {
			// Si adresses mail déjà existantes, l'API renvoie celles concernées
			if (error.message.includes('@'))
				return displayAlreadyExistingValuesOnImportModal({
					values: error.message,
					text: 'Certaines adresses mail fournies sont déjà existantes :',
				});
			// Si Zod renvoie un message indiquant un problème dans le format du CSV
			toast.error('Format du CSV incorrect');
		},
		onSettled: () => {
			toggleOverlay();
			closeImportModal();
		},
	});
};

// Générer le template CSV
export const useGetAgentsCsvTemplate = () => {
	return useQuery({
		queryKey: ['agentsCsv'],
		queryFn: async () => await fetchApi('/generateEmptyAgentsCsvFile'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};
