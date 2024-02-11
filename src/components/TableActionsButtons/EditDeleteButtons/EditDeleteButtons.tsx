import { Flex, Tooltip, ActionIcon } from '@mantine/core';
import {
	IconEdit,
	IconTrash,
	IconEditOff,
	IconTrashOff,
} from '@tabler/icons-react';
import { useGetCurrentUser } from '../../../utils/userQueries';

interface EditDeleteButtonsProps {
	editFunction: () => void;
	deleteFunction: () => void;
	checkRole?: boolean;
}

// Boutons affichés sur le côté gauche du tableau permettant d'éditer ou supprimer une ligne
export default function EditDeleteButtons({
	editFunction,
	deleteFunction,
	checkRole = true,
}: EditDeleteButtonsProps) {
	const { data: currentUser } = useGetCurrentUser();

	return checkRole && currentUser && currentUser.role === 'Consultant' ? (
		// Si l'utilisateur actuel est un consultant et qu'on demande à vérifier le rôle, il n'a pas accès aux boutons
		<Flex gap='md'>
			<Tooltip label='Non autorisé'>
				<ActionIcon
					style={{
						cursor: 'not-allowed',
					}}
					color='#B2B2B2'
					size='sm'
				>
					<IconEditOff />
				</ActionIcon>
			</Tooltip>
			<Tooltip label='Non autorisé'>
				<ActionIcon
					style={{
						cursor: 'not-allowed',
					}}
					color='#B2B2B2'
					size='sm'
				>
					<IconTrashOff />
				</ActionIcon>
			</Tooltip>
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
