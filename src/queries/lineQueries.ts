/* eslint-disable no-mixed-spaces-and-tabs */
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from '../utils/fetchApi';
import queryClient from './queryClient';
import { LineType, LineCreationType, LineUpdateType } from '../types/line';
import { DeviceType } from '../types/device';

export const useGetAllLines = () => {
	return useQuery({
		queryKey: ['lines'],
		queryFn: async () => {
			return (await fetchApi('/getAllLines')) as LineType[];
		},
	});
};

// Création de ligne
export const useCreateLine = () => {
	return useMutation({
		mutationFn: async ({
			data,
		}: {
			data: LineCreationType;
			updateDevice?: boolean; // Si une mise à jour d'appareil est nécessaire (changement de propriétaire)
			updateOldLine?: boolean; // Si une mise à jour d'une autre ligne est nécessaire
		}) => {
			return (await fetchApi('/createLine', 'POST', data)) as LineType;
		},

		onMutate: async (newLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines', 'models'] });
			// Snapshot du cache actuel
			const previousLines = queryClient.getQueryData(['lines']);
			const previousDevices = queryClient.getQueryData(['devices']);

			if (newLine.updateOldLine) {
				// Mise à jour de l'ancienne ligne pour retirer l'appareil et ajout de la nouvelle ligne dans le tableau
				queryClient.setQueryData(['lines'], (lines: LineType[]) => [
					...lines.map((line) =>
						line.deviceId === newLine.data.deviceId
							? { ...line, deviceId: null }
							: line
					),
					{
						...newLine.data,
					},
				]);
			} else {
				// Si pas d'ancienne ligne, uniquement ajout dans le tableau
				queryClient.setQueryData(['lines'], (lines: LineType[]) => [
					...lines,
					{
						...newLine.data,
					},
				]);
			}

			if (newLine.updateDevice) {
				// Si nécessaire, mise à jour de l'appareil pour mettre à jour le propriétaire
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

// Modification de ligne
export const useUpdateLine = () => {
	return useMutation({
		mutationFn: async ({
			data,
		}: {
			data: LineUpdateType;
			updateDevice?: boolean; // Si une mise à jour d'appareil est nécessaire (changement de propriétaire)
			updateOldLine?: boolean; // Si une mise à jour d'une autre ligne est nécessaire
		}) => {
			return (await fetchApi('/updateLine', 'PATCH', data)) as LineType;
		},

		onMutate: async (updatedLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines', 'models'] });
			const previousLines = queryClient.getQueryData(['lines']);
			const previousDevices = queryClient.getQueryData(['devices']);

			// Mises à jour de la ligne éditée et de l'ancienne ligne pour retirer l'appareil
			if (updatedLine.updateOldLine) {
				queryClient.setQueryData(['lines'], (lines: LineType[]) =>
					lines.map((line) => {
						if (
							line.deviceId === updatedLine.data.deviceId &&
							line.id !== updatedLine.data.id
						) {
							return { ...line, deviceId: null };
						} else if (line.id === updatedLine.data.id) {
							return updatedLine.data;
						} else {
							return line;
						}
					})
				);
			} else {
				// Si pas d'ancienne ligne, uniquement mise à jour de la ligne éditée
				queryClient.setQueryData(['lines'], (lines: LineType[]) =>
					lines.map((line) =>
						line.id === updatedLine.data.id
							? updatedLine.data
							: line
					)
				);
			}

			if (updatedLine.updateDevice) {
				// Si nécessaire, mise à jour de l'appareil pour mettre à jour le propriétaire
				queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
					devices.map((device) =>
						device.id === updatedLine.data.deviceId
							? { ...device, agentId: updatedLine.data.agentId }
							: device
					)
				);
			}

			return { previousLines, previousDevices };
		},
		onSuccess: () => toast.success('Appareil modifié avec succès'),
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

// Suppression de ligne
export const useDeleteLine = () => {
	return useMutation({
		mutationFn: async (lineId: number) => {
			return await fetchApi('/deleteLine', 'DELETE', { id: lineId });
		},

		onMutate: async (lineIdToDelete) => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
			const previousLines = queryClient.getQueryData(['lines']);
			queryClient.setQueryData(['lines'], (lines: LineType[]) =>
				lines?.filter((line) => line.id !== lineIdToDelete)
			);
			return previousLines as LineType[];
		},
		onSuccess: () => toast.success('Ligne supprimée avec succès'),
		onError: (_, __, previousLines) =>
			queryClient.setQueryData(['lines'], previousLines),
	});
};

// Exporter les appareils en CSV
export const useExportLinesToCsv = () => {
	return useQuery({
		queryKey: ['linesCsv'],
		queryFn: async () => await fetchApi('/generateLinesCsvFile'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
};
