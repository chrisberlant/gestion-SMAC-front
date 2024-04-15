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

	return currentUser?.role === 'Consultant' ? (
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
