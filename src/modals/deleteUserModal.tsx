import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { UserType } from '../types/user';

interface displayDeleteUserModalProps {
	row: MRT_Row<UserType>;
	deleteUser: ({ id }: { id: number }) => void;
}

const displayDeleteUserModal = ({
	row,
	deleteUser,
}: displayDeleteUserModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un utilisateur",
		children: (
			<Text>
				Voulez-vous vraiment supprimer l'utilisateur{' '}
				<span className='bold-text'>
					{row.original.firstName} {row.original.lastName}
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
		onConfirm: () => deleteUser({ id: row.original.id }),
	});

export default displayDeleteUserModal;
