import { useMutation, useQuery } from '@tanstack/react-query';
import {
	ModelCreationType,
	ModelType,
	ModelUpdateType,
} from '@customTypes/model';
import fetchApi from '@utils/fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllModels = () =>
	useQuery({
		queryKey: ['models'],
		queryFn: async () => {
			return (await fetchApi('/models')) as ModelType[];
		},
	});

export const useCreateModel = () =>
	useMutation({
		mutationFn: async (model: ModelCreationType) =>
			(await fetchApi('/model', 'POST', model)) as ModelType,
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

export const useUpdateModel = () =>
	useMutation({
		mutationFn: async (model: ModelUpdateType) => {
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
