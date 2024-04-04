/* eslint-disable no-mixed-spaces-and-tabs */
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from '@utils/fetchApi';
import queryClient from './queryClient';
import { LineType, LineCreationType, LineUpdateType } from '@customTypes/line';
import { DeviceType } from '@customTypes/device';
import displayAlreadyExistingValuesOnImportModal from '../modals/alreadyExistingValuesOnImportModal';

export const useGetAllLines = () =>
	useQuery({
		queryKey: ['lines'],
		queryFn: async () => {
			return (await fetchApi('/lines')) as LineType[];
		},
	});

// Création de ligne
export const useCreateLine = () =>
	useMutation({
		mutationFn: async ({
			data,
		}: {
			data: LineCreationType;
			updateDevice?: boolean; // Si une mise à jour d'appareil est nécessaire (changement de propriétaire)
			updateOldLine?: boolean; // Si une mise à jour d'une autre ligne est nécessaire
		}) => (await fetchApi('/line', 'POST', data)) as LineType,

		onMutate: async (newLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines', 'models'] });
			// Snapshot du cache actuel
			const previousLines: LineType | undefined =
				queryClient.getQueryData(['lines']);
			const previousDevices: DeviceType[] | undefined =
				queryClient.getQueryData(['devices']);

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
			if (previousValues?.previousLines)
				queryClient.setQueryData(
					['lines'],
					previousValues?.previousLines
				);
			if (updateDevice)
				queryClient.setQueryData(
					['devices'],
					previousValues?.previousDevices
				);
		},
	});

// Modification de ligne
export const useUpdateLine = () =>
	useMutation({
		mutationFn: async ({
			data,
		}: {
			data: LineUpdateType;
			updateDevice?: boolean; // Si une mise à jour d'appareil est nécessaire (changement de propriétaire)
			updateOldLine?: boolean; // Si une mise à jour d'une autre ligne est nécessaire
		}) => {
			const { id, ...infos } = data;
			return (await fetchApi(`/line/${id}`, 'PATCH', infos)) as LineType;
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
							? { ...line, ...updatedLine.data }
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

// Suppression de ligne
export const useDeleteLine = () =>
	useMutation({
		mutationFn: async (lineId: number) =>
			await fetchApi(`/line/${lineId}`, 'DELETE'),
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

// Exporter les appareils en CSV
export const useExportLinesToCsv = () =>
	useQuery({
		queryKey: ['linesCsv'],
		queryFn: async () => await fetchApi('/lines/csv'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});

// Créer des lignes à partir d'un CSV
export const useImportMultipleLines = (
	toggleOverlay: () => void,
	closeImportModal: () => void
) =>
	useMutation({
		mutationFn: async (importedLines: object[]) => {
			toggleOverlay();
			return await fetchApi('/lines/csv', 'POST', importedLines);
		},
		meta: {
			importMutation: 'true',
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['lines'] });
			toast.success('Lignes importées avec succès');
		},
		onError: (error) => {
			// Tableau contenant tous les éléments retournés
			const alreadyExistingItems = error.message.split(',');
			// Séparation de chaque type d'élement dans un tableau différent
			const alreadyExistingNumbers = alreadyExistingItems.filter((item) =>
				/^\d{10}$/.test(item)
			);
			const alreadyExistingImeis = alreadyExistingItems.filter((item) =>
				/^\d{15}$/.test(item)
			);

			// Si des numéros déjà existants et appareils déjà affectés
			if (
				alreadyExistingNumbers.length > 0 &&
				alreadyExistingImeis.length > 0
			)
				return displayAlreadyExistingValuesOnImportModal({
					text: 'Certains numéros de ligne fournis sont déjà existants :',
					values: alreadyExistingNumbers,
					secondaryText:
						'Certains IMEI fournis sont déjà existants :',
					secondaryValues: alreadyExistingImeis,
				});
			// Si des numéros déjà existants mais pas d'appareils déjà affectés
			if (
				alreadyExistingNumbers.length > 0 &&
				alreadyExistingImeis.length === 0
			)
				return displayAlreadyExistingValuesOnImportModal({
					text: 'Certains numéros de ligne fournis sont déjà existants :',
					values: alreadyExistingNumbers,
				});
			// Si des appareils déjà affectés mais pas de numéros déjà existants
			if (
				alreadyExistingImeis.length > 0 &&
				alreadyExistingNumbers.length === 0
			)
				return displayAlreadyExistingValuesOnImportModal({
					text: 'Certains IMEI fournis sont déjà existants :',
					values: alreadyExistingImeis,
				});

			// Si pas d'appareil/numéro déjà affecté mais que Zod renvoie un message indiquant un problème dans le format du CSV
			toast.error('Format du CSV incorrect');
		},
		onSettled: () => {
			toggleOverlay();
			closeImportModal();
		},
	});

// Générer le template CSV
export const useGetLinesCsvTemplate = () =>
	useQuery({
		queryKey: ['linesCsv'],
		queryFn: async () => await fetchApi('/lines/csv-template'),
		enabled: false,
		staleTime: 0,
		gcTime: 0,
	});
