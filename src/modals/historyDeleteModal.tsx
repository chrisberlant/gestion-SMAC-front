import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { UseMutateFunction } from '@tanstack/react-query';

export default function displayHistoryDeleteModal(
	deleteHistory: UseMutateFunction<unknown, Error, number[], unknown>,
	entriesToDelete: number[]
) {
	// Affichage uniquement si des lignes sont sélectionnées
	if (entriesToDelete.length > 0)
		return modals.openConfirmModal({
			title: "Suppression de l'historique",
			size: 'lg',
			children: (
				<>
					<Text mb='xs'>
						Voulez-vous vraiment supprimer l'ensemble de
						l'historique sélectionné ?
					</Text>
					<Text mb='xs'>Cette action est irréversible.</Text>
				</>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteHistory(entriesToDelete),
		});
}
