import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { UserType } from '@/types/user';

interface DisplayUserPasswordResetModalProps {
	row: MRT_Row<UserType>;
	resetPassword: (id: number) => void;
}

// Modale pour demander une confirmation à l'utilisateur
export const displayUserPasswordResetModal = ({
	row,
	resetPassword,
}: DisplayUserPasswordResetModalProps) =>
	modals.openConfirmModal({
		title: "Réinitialisation du mot de passe d'un utilisateur",
		children: (
			<Text mb='xl'>
				Voulez-vous vraiment réinitialiser le mot de passe de
				l'utilisateur{' '}
				<span className='bold-text'>
					{row.original.firstName} {row.original.lastName}
				</span>{' '}
				?
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Réinitialiser', cancel: 'Annuler' },
		confirmProps: { color: 'orange' },
		// Appel API
		onConfirm: () => resetPassword(row.original.id),
	});
