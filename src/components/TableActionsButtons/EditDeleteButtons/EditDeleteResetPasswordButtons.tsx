import { Flex, Tooltip, ActionIcon, Loader } from '@mantine/core';
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
	const { data: currentUser, isLoading } = useGetCurrentUser();

	if (isLoading) return <Loader />;

	if (currentUser)
		return currentUser.email === rowEmail || rowId === 1 ? (
			// Les options d'édition sont grisées pour l'utilisateur actuel et l'utilisateur root
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
						<IconKeyOff />
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
				<Tooltip label='Réinitialiser le mot de passe'>
					<ActionIcon
						color='orange'
						onClick={resetPasswordFunction}
						size='sm'
					>
						<IconKey />
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
