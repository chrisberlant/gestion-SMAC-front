import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';

interface DisplayUserDeleteModalProps {
	userId: number;
	userFullName: string;
	deleteUser: (id: number) => void;
}

const displayUserDeleteModal = ({
	userId,
	userFullName,
	deleteUser,
}: DisplayUserDeleteModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un utilisateur",
		children: (
			<Text>
				Voulez-vous vraiment supprimer l'utilisateur{' '}
				<span className='bold-text'>{userFullName}</span> ? Cette action
				est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteUser(userId),
	});

export default displayUserDeleteModal;
