import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from './fetchApi';
import queryClient from './queryClient';
import { LineType, LineCreationType, LineUpdateType } from '../types/line';
import { IdSelectionType } from '../types';
import { DeviceType } from '../types/device';

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
		mutationFn: async ({
			data,
		}: {
			data: LineCreationType;
			updateDevice?: boolean; // Si une mise à jour d'appareil est nécessaire (changement de propriétaire)
		}) => {
			return (await fetchApi('/createLine', 'POST', data)) as LineType;
		},

		onMutate: async (newLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines', 'models'] });
			// Snapshot du cache actuel
			const previousLines = queryClient.getQueryData(['lines']);
			const previousDevices = queryClient.getQueryData(['devices']);
			// Ajout de la nouvelle ligne dans le tableau
			queryClient.setQueryData(['lines'], (lines: LineType[]) => [
				...lines,
				{
					...newLine.data,
				},
			]);

			if (newLine.updateDevice) {
				// Si nécessaire, mise à jour des appareils pour définir le nouveau propriétaire
				queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
					devices.map((device) =>
						device.id === newLine.data.deviceId
							? { ...device, agentId: newLine.data.agentId }
							: device
					)
				);
			}

			return { previousLines, previousDevices };
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
		onError: (_, { updateDevice }, previousValues) => {
			queryClient.setQueryData(['lines'], previousValues?.previousLines);
			if (updateDevice)
				queryClient.setQueryData(
					['devices'],
					previousValues?.previousDevices
				);
		},
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
