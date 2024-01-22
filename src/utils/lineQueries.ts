import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LineType } from '../types';
import fetchApi from './fetchApi';
import queryClient from './queryClient';

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
