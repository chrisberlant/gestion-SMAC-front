import { Flex, Tooltip, ActionIcon } from '@mantine/core';
import {
	IconEdit,
	IconTrash,
	IconEditOff,
	IconTrashOff,
} from '@tabler/icons-react';
import { useGetCurrentUser } from '@/hooks/authQueries';

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

	if (currentUser)
		return currentUser.role === 'Consultant' ? (
			<Flex gap='md'>
				<ActionIcon disabled size='sm'>
					<IconEditOff />
				</ActionIcon>
				<ActionIcon disabled size='sm'>
					<IconTrashOff />
				</ActionIcon>
			</Flex>
		) : (
			<Flex gap='md' miw={70}>
				<Tooltip
					label='Modifier'
					events={{ hover: true, focus: true, touch: false }}
				>
					<ActionIcon
						aria-label='Modifier'
						onClick={editFunction}
						size='sm'
					>
						<IconEdit />
					</ActionIcon>
				</Tooltip>
				<Tooltip
					label='Supprimer'
					events={{ hover: true, focus: true, touch: false }}
				>
					<ActionIcon
						aria-label='Modifier'
						color='red'
						onClick={deleteFunction}
						size='sm'
					>
						<IconTrash />
					</ActionIcon>
				</Tooltip>
			</Flex>
		);
}
