import { Flex, Tooltip, ActionIcon } from '@mantine/core';
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
}

// Boutons affichés sur le côté gauche du tableau permettant d'éditer ou supprimer une ligne
export default function EditDeleteButtons({
	editFunction,
	deleteFunction,
}: EditDeleteButtonsProps) {
	const { data: currentUser } = useGetCurrentUser();

	return currentUser?.role !== 'Admin' && currentUser?.role !== 'Tech' ? (
		<Flex gap='md'>
			<ActionIcon disabled size='sm'>
				<IconEditOff />
			</ActionIcon>
			<ActionIcon disabled size='sm'>
				<IconTrashOff />
			</ActionIcon>
		</Flex>
	) : (
		<Flex gap='md'>
			<Tooltip
				label='Modifier'
				events={{ hover: true, focus: true, touch: false }}
			>
				<ActionIcon onClick={editFunction} size='sm'>
					<IconEdit />
				</ActionIcon>
			</Tooltip>
			<Tooltip
				label='Supprimer'
				events={{ hover: true, focus: true, touch: false }}
			>
				<ActionIcon color='red' onClick={deleteFunction} size='sm'>
					<IconTrash />
				</ActionIcon>
			</Tooltip>
		</Flex>
	);
}
