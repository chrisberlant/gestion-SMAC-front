import { ActionIcon, Button, Flex, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCopy, IconMail } from '@tabler/icons-react';
import { toast } from 'sonner';
import { UserPasswordIsResetType } from '@customTypes/user';
import { sendEmail } from '@utils/index';

// Modale pour indiquer le succès et permettre l'affichage et l'envoi du nouveau mot de passe
export const displayUserPasswordResetConfirmationModal = (
	user: UserPasswordIsResetType
) =>
	modals.open({
		title: 'Confirmation de la réinitialisation',
		size: 'md',
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
