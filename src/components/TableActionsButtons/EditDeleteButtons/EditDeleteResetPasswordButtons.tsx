import { Flex, Tooltip, ActionIcon } from '@mantine/core';
import {
	IconEdit,
	IconTrash,
	IconEditOff,
	IconTrashOff,
	IconKey,
	IconKeyOff,
} from '@tabler/icons-react';
import { useGetCurrentUser } from '@queries/userQueries';

interface EditDeleteResetPasswordButtonsProps {
	editFunction: () => void;
	deleteFunction: () => void;
	resetPasswordFunction: () => void;
	rowEmail: string;
	rowId: number;
}

// Boutons affichés sur le côté gauche du tableau permettant d'éditer ou supprimer une ligne
export default function EditDeleteResetPasswordButtons({
	editFunction,
	deleteFunction,
	resetPasswordFunction,
	rowEmail,
	rowId,
}: EditDeleteResetPasswordButtonsProps) {
	const { data: currentUser } = useGetCurrentUser();

	return currentUser?.email === rowEmail || rowId === 1 ? (
		// Les options d'édition sont grisées pour l'utilisateur actuel et l'utilisateur root
		<Flex gap='md'>
			<ActionIcon disabled size='sm'>
				<IconEditOff />
			</ActionIcon>
			<ActionIcon disabled size='sm'>
				<IconKeyOff />
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
				label='Réinitialiser le mot de passe'
				events={{ hover: true, focus: true, touch: false }}
			>
				<ActionIcon
					color='orange'
					onClick={resetPasswordFunction}
					size='sm'
				>
					<IconKey />
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
