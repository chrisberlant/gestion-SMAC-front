import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';
import {
	AgentCreationType,
	AgentType,
	AgentUpdateType,
} from '@customTypes/agent';
import displayErrorOnImportModal from '@/modals/errorOnImportModal';
import { isJson } from '../utils';

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
				{
					...newAgent,
				},
				...agents,
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
		onError: (_, __, previousAgents) =>
			queryClient.setQueryData(['agents'], previousAgents),
	});

// Ajout rapide d'un agent via modale, ajout de la gestion du overlay et fermeture de la modale
export const useQuickCreateAgent = (
	toggleOverlay: () => void,
	closeQuickAddModal: () => void
) =>
	useMutation({
		mutationFn: async (newAgent: AgentCreationType) => {
			toggleOverlay();
			return (await fetchApi('/agent', 'POST', newAgent)) as AgentType;
		},
		onSuccess: async (newAgent) => {
			queryClient.setQueryData(['agents'], (agents: AgentType[]) => [
				...agents,
				{
					...newAgent,
				},
			]);
			toast.success('Agent créé avec succès');
		},
		onSettled: () => {
			toggleOverlay();
			closeQuickAddModal();
		},
	});

// Mettre à jour un agent
export const useUpdateAgent = () =>
	useMutation({
		mutationFn: async (agent: AgentUpdateType) => {
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
						? { ...agent, ...updatedAgent }
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
export const useExportAgentsToCsv = () =>
	useQuery({
		queryKey: ['agentsCsv'],
		queryFn: async () => await fetchApi('/agents/csv'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});

// Créer des agents à partir d'un CSV
export const useImportMultipleAgents = (
	toggleOverlay: () => void,
	closeImportModal: () => void
) =>
	useMutation({
		mutationFn: async (importedAgents: object[]) => {
			toggleOverlay();
			const response = await fetchApi(
				'/agents/csv',
				'POST',
				importedAgents
			);
			console.log(response);
			return response;
		},
		meta: {
			importMutation: 'true',
		},
		onMutate: async () =>
			await queryClient.cancelQueries({ queryKey: ['agents'] }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['agents'] });
			toast.success('Agents importés avec succès');
		},
		onError: (error) => {
			if (!isJson(error.message)) return toast.error(error.message);

			const errors = JSON.parse(error.message);
			// Création d'un nouvel objet afin d'afficher un message personnalisé dans la modale qui sera appelée
			const formatedErrors: {
				message: string;
				values: string[];
			}[] = [];

			if (errors.usedEmails.length > 0)
				formatedErrors.push({
					message:
						'Les adresses mail suivantes sont déjà existantes :',
					values: errors.usedEmails,
				});

			if (errors.unknownServices.length > 0)
				formatedErrors.push({
					message: 'Les services suivants sont introuvables :',
					values: errors.unknownServices,
				});

			// Si conflits, affichage de la modale
			if (formatedErrors.length > 0)
				return displayErrorOnImportModal(formatedErrors);

			// Sinon Zod renvoie un message indiquant un problème dans le format du CSV
			return toast.error('Format du CSV incorrect');
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
