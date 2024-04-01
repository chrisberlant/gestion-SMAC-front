import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';
import { AgentCreationType, AgentType } from '@customTypes/agent';
import displayAlreadyExistingValuesOnImportModal from '../modals/alreadyExistingValuesOnImportModal';

// Récupérer tous les agents
export const useGetAllAgents = () =>
	useQuery({
		queryKey: ['agents'],
		queryFn: async () => {
			return (await fetchApi('/agents')) as AgentType[];
		},
	});

// Créer un agent
export const useCreateAgent = () =>
	useMutation({
		mutationFn: async (newAgent: AgentCreationType) => {
			return (await fetchApi('/agent', 'POST', newAgent)) as AgentType;
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

// Mettre à jour un agent
export const useUpdateAgent = () =>
	useMutation({
		mutationFn: async (agent: AgentType) => {
			const { id, ...infos } = agent;
			return (await fetchApi(
				`/agent/${id}`,
				'PATCH',
				infos
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

// Supprimer un agent
export const useDeleteAgent = () =>
	useMutation({
		mutationFn: async (agentId: number) =>
			await fetchApi(`/agent/${agentId}`, 'DELETE'),
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

// Exporter les agents en CSV
export const useExportAgentsToCsv = () => {
	return useQuery({
		queryKey: ['agentsCsv'],
		queryFn: async () => await fetchApi('/agents/csv'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};

// Créer des agents à partir d'un CSV
export const useImportMultipleAgents = (
	toggleOverlay: () => void,
	closeImportModal: () => void
) =>
	useMutation({
		mutationFn: async (importedAgents: object[]) => {
			toggleOverlay();
			return await fetchApi('/agents/csv', 'POST', importedAgents);
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
			// Si adresses mail déjà existantes, la modale est affichée
			if (error.message.includes('@'))
				return displayAlreadyExistingValuesOnImportModal({
					text: 'Certaines adresses mail fournies sont déjà existantes :',
					values: error.message.split(','),
				});
			// Si Zod renvoie un message indiquant un problème dans le format du CSV
			toast.error('Format du CSV incorrect');
		},
		onSettled: () => {
			toggleOverlay();
			closeImportModal();
		},
	});

// Générer le template CSV
export const useGetAgentsCsvTemplate = () =>
	useQuery({
		queryKey: ['agentsCsv'],
		queryFn: async () => await fetchApi('/agents/csv-template'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
