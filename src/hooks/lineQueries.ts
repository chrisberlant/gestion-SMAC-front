/* eslint-disable no-mixed-spaces-and-tabs */
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import fetchApi from '@/utils/fetchApi';
import queryClient from './queryClient';
import { LineType, LineCreationType, LineUpdateType } from '@/types/line';
import { DeviceType } from '@/types/device';
import displayErrorOnImportModal from '@/modals/errorOnImportModal';
import { isJson } from '@/utils';

export const useGetAllLines = () =>
	useQuery({
		queryKey: ['lines'],
		queryFn: async () => (await fetchApi('/lines')) as LineType[],
	});

// Création de ligne
export const useCreateLine = () =>
	useMutation({
		mutationFn: async (data: LineCreationType) =>
			(await fetchApi('/line', 'POST', data)) as LineType,
		onMutate: async (newLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
			// Snapshot du cache actuel
			const previousLines = queryClient.getQueryData(['lines']);
			newLine.deviceId
				? // Si appareil fourni, mise à jour de l'ancienne ligne pour retirer l'appareil et ajout de la nouvelle ligne dans le tableau
				  queryClient.setQueryData(['lines'], (lines: LineType[]) => [
						{
							...newLine,
						},
						...lines.map((line) =>
							line.deviceId === newLine.deviceId
								? { ...line, deviceId: null }
								: line
						),
				  ])
				: // Si pas d'appareil fourni, uniquement ajout de la nouvelle ligne dans le tableau
				  queryClient.setQueryData(['lines'], (lines: LineType[]) => [
						{
							...newLine,
						},
						...lines,
				  ]);

			return previousLines;
		},
		onSuccess: (receivedData, sentData) => {
			queryClient.setQueryData(['lines'], (lines: LineType[]) =>
				lines.map((line) =>
					line.number === receivedData.number
						? { ...line, id: receivedData.id }
						: line
				)
			);
			if (sentData.deviceId) {
				// Si nécessaire, mise à jour de l'appareil pour changer le propriétaire
				queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
					devices.map((device) =>
						device.id === receivedData.deviceId
							? { ...device, agentId: receivedData.agentId }
							: device
					)
				);
			}
			toast.success('Ligne créée avec succès');
		},
		onError: (_, __, previousLines) =>
			queryClient.setQueryData(['lines'], previousLines),
	});

// Modification de ligne
export const useUpdateLine = () =>
	useMutation({
		mutationFn: async (data: LineUpdateType) => {
			const { id, ...infos } = data;
			return (await fetchApi(`/line/${id}`, 'PATCH', infos)) as LineType;
		},
		onMutate: async (updatedLine) => {
			await queryClient.cancelQueries({ queryKey: ['lines'] });
			const previousLines = queryClient.getQueryData(['lines']);
			// Mises à jour de la ligne éditée et de l'ancienne ligne pour retirer l'appareil
			updatedLine.deviceId
				? // Si modification de l'appareil affecté (non nul)
				  queryClient.setQueryData(['lines'], (lines: LineType[]) =>
						lines.map((line) => {
							if (line.id === updatedLine.id) {
								return { ...line, ...updatedLine };
							}
							if (
								line.deviceId === updatedLine.deviceId &&
								line.id !== updatedLine.id
							) {
								return { ...line, deviceId: null };
							}
							return line;
						})
				  )
				: // Si suppression de l'appareil affecté ou aucune modification de celui-ci
				  queryClient.setQueryData(['lines'], (lines: LineType[]) =>
						lines.map((line) =>
							line.id === updatedLine.id
								? { ...line, ...updatedLine }
								: line
						)
				  );
			return previousLines;
		},
		onSuccess: (receivedData, sentData) => {
			// Si nécessaire, mise à jour de l'appareil pour mettre à jour le propriétaire
			if (sentData.deviceId || sentData.agentId !== undefined) {
				queryClient.setQueryData(['devices'], (devices: DeviceType[]) =>
					devices.map((device) =>
						device.id === receivedData.deviceId
							? { ...device, agentId: receivedData.agentId }
							: device
					)
				);
			}
			toast.success('Ligne modifiée avec succès');
		},
		onError: (_, __, previousLines) =>
			queryClient.setQueryData(['lines'], previousLines),
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
			return previousLines;
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
			if (!isJson(error.message)) return toast.error(error.message);

			const errors = JSON.parse(error.message);
			// Création d'un nouvel objet afin d'afficher un message personnalisé dans la modale qui sera appelée
			const formatedErrors: {
				message: string;
				values: string[];
			}[] = [];

			if (errors.usedNumbers.length > 0)
				formatedErrors.push({
					message:
						'Certains numéros de ligne fournis sont déjà existants :',
					values: errors.usedNumbers,
				});

			if (errors.usedDevices.length > 0)
				formatedErrors.push({
					message: 'Les appareils suivants sont déjà existants :',
					values: errors.usedDevices,
				});

			if (errors.unknownDevices.length > 0)
				formatedErrors.push({
					message: 'Les appareils suivants sont introuvables :',
					values: errors.unknownDevices,
				});

			if (errors.unknownAgents.length > 0)
				formatedErrors.push({
					message: 'Les agents suivants sont introuvables :',
					values: errors.unknownAgents,
				});

			// Si conflits, affichage de la modale
			if (formatedErrors.length > 0)
				return displayErrorOnImportModal(formatedErrors);

			// Sinon Zod renvoie un message indiquant un problème dans le format du CSV
			return toast.error('Format du CSV incorrect');
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
