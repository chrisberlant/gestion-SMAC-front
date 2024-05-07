import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Tooltip } from '@mantine/core';
import { UserType, UserPasswordIsResetType } from '@customTypes/user';
import { IconCopy, IconMail } from '@tabler/icons-react';
import { toast } from 'sonner';
import { sendEmail } from '@utils/index';

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
			<Text mb='xs'>
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

// Modale pour indiquer le succès et permettre l'affichage et l'envoi du nouveau mot de passe
export const displayUserPasswordResetSuccessModal = (
	user: UserPasswordIsResetType
) =>
	modals.open({
		title: 'Confirmation de la réinitialisation',
		children: (
			<>
				<Text>
					Le mot de passe de{' '}
					<span className='bold-text'>{user.fullName}</span> a bien
					été réinitialisé.
				</Text>
				<Text>Le nouveau mot de passe à fournir est : </Text>
				<Flex gap='md' my='xl' justify='center' align='center'>
					<Text>{user.generatedPassword}</Text>
					<Tooltip label='Copier dans le presse-papiers'>
						<ActionIcon
							onClick={() => {
								navigator.clipboard.writeText(
									user.generatedPassword
								);
								toast.info(
									'Mot de passe copié dans le presse-papiers'
								);
							}}
						>
							<IconCopy />
						</ActionIcon>
					</Tooltip>
					{/* Envoi en utilisant le client de messagerie par défaut */}
					<Tooltip label='Envoyer par e-mail'>
						<ActionIcon
							onClick={() =>
								sendEmail(
									user.email,
									'Réinitialisation de votre mot de passe sur Gestion-SMAC',
									`Bonjour ${user.fullName},\r\rVotre mot de passe a été réinitialisé.\r\rVous pouvez désormais vous connecter avec le nouveau : ${user.generatedPassword}\r\r`
								)
							}
						>
							<IconMail />
						</ActionIcon>
					</Tooltip>
				</Flex>
				<Button fullWidth onClick={() => modals.closeAll()}>
					OK
				</Button>
			</>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
	});
