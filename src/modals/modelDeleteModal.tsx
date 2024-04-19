import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';

interface DisplayModelDeleteModalProps {
	modelId: number;
	modelFullName: string;
	deleteModel: (id: number) => void;
}

const DisplayModelDeleteModal = ({
	modelId,
	modelFullName,
	deleteModel,
}: DisplayModelDeleteModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un modèle",
		children: (
			<Text>
				Voulez-vous vraiment supprimer le modèle{' '}
				<span className='bold-text'>{modelFullName}</span> ? Cette
				action est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteModel(modelId),
	});

export default DisplayModelDeleteModal;
