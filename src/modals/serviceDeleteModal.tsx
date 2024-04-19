import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';

interface DisplayServiceDeleteModalProps {
	serviceId: number;
	serviceTitle: string;
	deleteService: (id: number) => void;
}

const displayServiceDeleteModal = ({
	serviceId,
	serviceTitle,
	deleteService,
}: DisplayServiceDeleteModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un service",
		children: (
			<Text>
				Voulez-vous vraiment supprimer le service{' '}
				<span className='bold-text'>{serviceTitle}</span> ? Cette action
				est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteService(serviceId),
	});

export default displayServiceDeleteModal;
