import { useMutation, useQuery } from '@tanstack/react-query';
import fetchApi from '@/utils/fetchApi';
import { HistoryType } from '@/types/history';
import { toast } from 'sonner';
import queryClient from './queryClient';

export const useGetAllHistory = () =>
	useQuery({
		queryKey: ['history'],
		queryFn: async () => (await fetchApi('/history')) as HistoryType[],
		staleTime: 0,
		gcTime: 0,
	});

export const useDeleteHistory = () =>
	useMutation({
		mutationFn: async (data: number[]) =>
			await fetchApi('/history', 'DELETE', data),
		onMutate: async (idsToDelete: number[]) => {
			await queryClient.cancelQueries({ queryKey: ['history'] });
			const previousHistory = queryClient.getQueryData(['history']);
			queryClient.setQueryData(['history'], (entries: HistoryType[]) =>
				entries?.filter((entry) => !idsToDelete.includes(entry.id))
			);
			return previousHistory;
		},
		onSuccess: () =>
			toast.success('Historique sélectionné supprimé avec succès'),
		onError: (_, __, previousHistory) =>
			queryClient.setQueryData(['history'], previousHistory),
	});
