import { Flex, Tooltip, ActionIcon, Loader } from '@mantine/core';
import {
	IconEdit,
	IconTrash,
	IconEditOff,
	IconTrashOff,
} from '@tabler/icons-react';
import { useGetCurrentUser } from '@queries/userQueries';

interface EditDeleteButtonsProps {
	editFunction: () => void;
	deleteFunction: () => void;
	roleCheck?: boolean; // Vérifier manuellement le rôle, passer à false si déjà effectué, par exemple une route admin
}

// Boutons affichés sur le côté gauche du tableau permettant d'éditer ou supprimer une ligne
export default function EditDeleteButtons({
	editFunction,
	deleteFunction,
	roleCheck = true,
}: EditDeleteButtonsProps) {
	const { data: currentUser, isLoading } = useGetCurrentUser();

	if (isLoading) return <Loader />;

	if (currentUser)
		return roleCheck && currentUser.role === 'Consultant' ? (
			// Si on demande à vérifier le rôle et que l'utilisateur actuel est un consultant, il n'a pas accès aux boutons
			<Flex gap='md'>
				<ActionIcon
					style={{
						cursor: 'not-allowed',
					}}
					color='#B2B2B2'
					size='sm'
				>
					<IconEditOff />
				</ActionIcon>

				<ActionIcon
					style={{
						cursor: 'not-allowed',
					}}
					color='#B2B2B2'
					size='sm'
				>
					<IconTrashOff />
				</ActionIcon>
			</Flex>
		) : (
			<Flex gap='md'>
				<Tooltip label='Modifier'>
					<ActionIcon onClick={editFunction} size='sm'>
						<IconEdit />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Supprimer'>
					<ActionIcon color='red' onClick={deleteFunction} size='sm'>
						<IconTrash />
					</ActionIcon>
				</Tooltip>
			</Flex>
		);
}
