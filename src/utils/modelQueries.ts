import { useMutation, useQuery } from '@tanstack/react-query';
import { ModelType } from '../types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllModels = () => {
	return useQuery({
		queryKey: ['models'],
		queryFn: async () => {
			return (await fetchApi('/getAllModels')) as ModelType[];
		},
	});
};

export const useCreateModel = () => {
	return useMutation({
		mutationFn: async (model: ModelType) => {
			return (await fetchApi('/createModel', 'POST', model)) as ModelType;
		},

		onMutate: async (newModel: ModelType) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) => [
				...models,
				{
					...newModel,
				},
			]);
			return { previousModels };
		},
		onSuccess: (newModel: ModelType) => {
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
		onError: (_, __, context) =>
			queryClient.setQueryData(['models'], context?.previousModels),
	});
};

export const useUpdateModel = () => {
	return useMutation({
		mutationFn: async (model: ModelType) => {
			return (await fetchApi(
				'/updateModel',
				'PATCH',
				model
			)) as ModelType;
		},

		onMutate: async (newModel: ModelType) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models.map((prevModel) =>
					prevModel.id === newModel.id ? newModel : prevModel
				)
			);
			return { previousModels };
		},
		onSuccess: () => toast.success('Modèle modifié avec succès'),
		onError: (_, __, context) =>
			queryClient.setQueryData(['models'], context?.previousModels),
	});
};

export const useDeleteModel = () => {
	return useMutation({
		mutationFn: async (model: { id: number }) => {
			return (await fetchApi(
				'/deleteModel',
				'DELETE',
				model
			)) as ModelType;
		},

		onMutate: async (modelToDelete: { id: number }) => {
			await queryClient.cancelQueries({ queryKey: ['models'] });
			const previousModels = queryClient.getQueryData(['models']);
			queryClient.setQueryData(['models'], (models: ModelType[]) =>
				models?.filter(
					(model: ModelType) => model.id !== modelToDelete.id
				)
			);
			return { previousModels };
		},
		onSuccess: () => toast.success('Modèle supprimé avec succès'),
		onError: (_, __, context) =>
			queryClient.setQueryData(['models'], context?.previousModels),
	});
};
