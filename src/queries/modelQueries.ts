import { useMutation, useQuery } from '@tanstack/react-query';
import { ModelCreationType, ModelType } from '@customTypes/model';
import fetchApi from '@utils/fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllModels = () => {
	return useQuery({
		queryKey: ['models'],
		queryFn: async () => {
			return (await fetchApi('/models')) as ModelType[];
		},
	});
};

export const useCreateModel = () => {
	return useMutation({
		mutationFn: async (model: ModelCreationType) => {
			return (await fetchApi('/model', 'POST', model)) as ModelType;
		},
		onMutate: async (newModel) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels: ModelType[] | undefined =
				queryClient.getQueryData(['models']);
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
		onError: (_, __, previousModels) => {
			if (previousModels)
				queryClient.setQueryData(['models'], previousModels);
		},
	});
};

export const useUpdateModel = () => {
	return useMutation({
		mutationFn: async (model: ModelType) => {
			const { id, ...infos } = model;
			return (await fetchApi(
				`/model/${id}`,
				'PATCH',
				infos
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
		mutationFn: async (modelId: number) => {
			return (await fetchApi(`/model/${modelId}`, 'DELETE')) as ModelType;
		},
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
};
