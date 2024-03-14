import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { ModelType } from '../types/model';

interface displayDeleteModelModalProps {
	row: MRT_Row<ModelType>;
	deleteModel: ({ id }: { id: number }) => void;
}

const displayDeleteModelModal = ({
	row,
	deleteModel,
}: displayDeleteModelModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un modèle",
		children: (
			<Text>
				Voulez-vous vraiment supprimer le modèle{' '}
				<span className='bold-text'>
					{`${row.original.brand} ${row.original.reference} ${
						row.original.storage
							? `de stockage ${row.original.storage}`
							: ''
					}`}
				</span>{' '}
				? Cette action est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteModel({ id: row.original.id }),
	});

export default displayDeleteModelModal;
