import { useMutation, useQuery } from '@tanstack/react-query';
import { LineType } from '../types';
import fetchApi from './fetchApi';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllAttributedLines = () => {
	return useQuery({
		queryKey: ['lines'],
		queryFn: async () => {
			return (await fetchApi('/getAllLines/attributed')) as LineType[];
		},
	});
};

export const useGetAllResiliatedLines = () => {
	return useQuery({
		queryKey: ['resiliatedLines'],
		queryFn: async () => {
			return (await fetchApi('/getAllLines/resiliated')) as LineType[];
		},
	});
};

export const useCreateLine = () => {
	return useMutation({
		mutationFn: async (line: LineType) => {
			return await fetchApi('/createLine', 'POST', line);
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
		onSuccess: (newLine: LineType) => {
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
