import { useMutation, useQuery } from '@tanstack/react-query';
import { ModelType, ModelCreationType, ModelUpdateType } from '../types/model';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';
import { IdSelectionType } from '../types';

export const useGetAllModels = () => {
	return useQuery({
		queryKey: ['models'],
		queryFn: async () => {
			return (await fetchApi('/getAllModels')) as ModelType[];
		},
		staleTime: Infinity,
	});
};

export const useCreateModel = () => {
	return useMutation({
		mutationFn: async (model: ModelCreationType) => {
			return (await fetchApi('/createModel', 'POST', model)) as ModelType;
		},

		onMutate: async (newModel) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) => [
				...models,
				{
					...newModel,
				},
			]);
			return previousModels;
		},
		onSuccess: (newModel) => {
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models.map((model) =>
					model.brand === newModel.brand &&
					model.reference === newModel.reference &&
					(!model.storage || model.storage === newModel.storage)
						? { ...model, id: newModel.id }
						: model
				)
			);
			toast.success('Modèle créé avec succès');
		},
		onError: (_, __, previousModels) =>
			queryClient.setQueryData(['models'], previousModels),
	});
};

export const useUpdateModel = () => {
	return useMutation({
		mutationFn: async (model: ModelUpdateType) => {
			return (await fetchApi(
				'/updateModel',
				'PATCH',
				model
			)) as ModelType;
		},

		onMutate: async (updatedModel) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models.map((model) =>
					model.id === updatedModel.id ? updatedModel : model
				)
			);
			return previousModels;
		},
		onSuccess: () => toast.success('Modèle modifié avec succès'),
		onError: (_, __, previousModels) =>
			queryClient.setQueryData(['models'], previousModels),
	});
};

export const useDeleteModel = () => {
	return useMutation({
		mutationFn: async (model: IdSelectionType) => {
			return (await fetchApi(
				'/deleteModel',
				'DELETE',
				model
			)) as ModelType;
		},

		onMutate: async (modelToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models?.filter(
					(model: ModelType) => model.id !== modelToDelete.id
				)
			);
			return previousModels;
		},
		onSuccess: () => toast.success('Modèle supprimé avec succès'),
		onError: (_, __, previousModels) =>
			queryClient.setQueryData(['models'], previousModels),
	});
};
