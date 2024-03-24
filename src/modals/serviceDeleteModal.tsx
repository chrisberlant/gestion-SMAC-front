import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { ServiceType } from '@customTypes/service';

interface DisplayServiceDeleteModalProps {
	row: MRT_Row<ServiceType>;
	deleteService: (id: number) => void;
}

const displayServiceDeleteModal = ({
	row,
	deleteService,
}: DisplayServiceDeleteModalProps) =>
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
		onConfirm: () => deleteService(row.original.id),
	});

export default displayServiceDeleteModal;
