import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { ServiceType } from '../types/service';

interface displayDeleteServiceModalProps {
	row: MRT_Row<ServiceType>;
	deleteService: ({ id }: { id: number }) => void;
}

const displayDeleteServiceModal = ({
	row,
	deleteService,
}: displayDeleteServiceModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un service",
		children: (
			<Text>
				Voulez-vous vraiment supprimer le service{' '}
				<span className='bold-text'>{row.original.title}</span> ? Cette
				action est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteService({ id: row.original.id }),
	});

export default displayDeleteServiceModal;
