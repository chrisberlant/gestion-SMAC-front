import { useMutation, useQuery } from '@tanstack/react-query';
import { ModelCreationType, ModelType, ModelUpdateType } from '@/types/model';
import fetchApi from '@/utils/fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllModels = () =>
	useQuery({
		queryKey: ['models'],
		queryFn: async () => (await fetchApi('/models')) as ModelType[],
	});

export const useCreateModel = () =>
	useMutation({
		mutationFn: async (model: ModelCreationType) =>
			await fetchApi('/model', 'POST', model),
		onMutate: async (newModel) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) => [
				{
					...newModel,
				},
				...models,
			]);
			return previousModels;
		},
		onSuccess: (newModel: ModelType) => {
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models.map((model) =>
					model.brand === newModel.brand &&
					model.reference === newModel.reference &&
					(model?.storage === newModel?.storage ||
						(!model.storage && !newModel.storage))
						? { ...model, id: newModel.id }
						: model
				)
			);
			toast.success('Modèle créé avec succès');
		},
		onError: (_, __, previousModels) =>
			queryClient.setQueryData(['models'], previousModels),
	});

export const useUpdateModel = () =>
	useMutation({
		mutationFn: async (model: ModelUpdateType) => {
			const { id, ...infos } = model;
			return await fetchApi(`/model/${id}`, 'PATCH', infos);
		},
		onMutate: async (updatedModel) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models.map((model) =>
					model.id === updatedModel.id
						? { ...model, ...updatedModel }
						: model
				)
			);
			return previousModels;
		},
		onSuccess: () => toast.success('Modèle modifié avec succès'),
		onError: (_, __, previousModels) =>
			queryClient.setQueryData(['models'], previousModels),
	});

export const useDeleteModel = () =>
	useMutation({
		mutationFn: async (modelId: number) =>
			(await fetchApi(`/model/${modelId}`, 'DELETE')) as ModelType,
		onMutate: async (modelIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models?.filter(
					(model: ModelType) => model.id !== modelIdToDelete
				)
			);
			return previousModels;
		},
		onSuccess: () => toast.success('Modèle supprimé avec succès'),
		onError: (_, __, previousModels) =>
			queryClient.setQueryData(['models'], previousModels),
	});
