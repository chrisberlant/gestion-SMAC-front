import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from './fetchApi';
import queryClient from './queryClient';
import { LineType, LineCreationType, LineUpdateType } from '../types/line';
import { IdSelectionType } from '../types';

export const useGetAllLines = () => {
	return useQuery({
		queryKey: ['lines'],
		queryFn: async () => {
			return (await fetchApi('/getAllLines')) as LineType[];
		},
	});
};

export const useCreateLine = () => {
	return useMutation({
		mutationFn: async (line: LineCreationType) => {
			return (await fetchApi('/createLine', 'POST', line)) as LineType;
		},

		onMutate: async (newLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
			const previousLines = queryClient.getQueryData(['lines']);
			queryClient.setQueryData(['lines'], (lines: LineType[]) => [
				...lines,
				{
					...newLine,
				},
			]);
			return previousLines;
		},
		onSuccess: (newLine) => {
			queryClient.setQueryData(['lines'], (lines: LineType[]) =>
				lines.map((line) =>
					line.number === newLine.number
						? { ...line, id: newLine.id }
						: line
				)
			);
			toast.success('Ligne créée avec succès');
		},
		onError: (_, __, previousLines) =>
			queryClient.setQueryData(['lines'], previousLines),
	});
};

export const useUpdateLine = () => {
	return useMutation({
		mutationFn: async (line: LineUpdateType) => {
			return (await fetchApi('/updateLine', 'PATCH', line)) as LineType;
		},

		onMutate: async (updatedLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
			const previousLines = queryClient.getQueryData(['lines']);
			queryClient.setQueryData(['lines'], (lines: LineType[]) =>
				lines.map((line) =>
					line.id === updatedLine.id ? updatedLine : line
				)
			);
			return previousLines;
		},
		onSuccess: () => toast.success('Appareil modifié avec succès'),
		onError: (_, __, previousLines) =>
			queryClient.setQueryData(['lines'], previousLines),
	});
};

export const useDeleteLine = () => {
	return useMutation({
		mutationFn: async (line: IdSelectionType) => {
			return (await fetchApi('/deleteLine', 'DELETE', line)) as LineType;
		},

		onMutate: async (lineToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
			const previousLines = queryClient.getQueryData(['lines']);
			queryClient.setQueryData(['lines'], (lines: LineType[]) =>
				lines?.filter((line) => line.id !== lineToDelete.id)
			);
			return previousLines;
		},
		onSuccess: () => toast.success('Ligne supprimée avec succès'),
		onError: (_, __, previousLines) =>
			queryClient.setQueryData(['lines'], previousLines),
	});
};
