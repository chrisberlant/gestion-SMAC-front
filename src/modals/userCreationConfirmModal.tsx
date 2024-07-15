import {
	ActionIcon,
	Button,
	Flex,
	PasswordInput,
	Text,
	Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCopy, IconMail } from '@tabler/icons-react';
import { toast } from 'sonner';
import { UserInfosAndPasswordType } from '@/types/user';
import { sendEmail } from '@/utils';

// Modale pour indiquer le succès de la créatioon et permettre l'affichage et l'envoi du nouveau mot de passe
export const displayUserCreationConfirmModal = (
	user: UserInfosAndPasswordType
) =>
	modals.open({
		title: 'Confirmation de la création du compte',
		size: 'md',
		children: (
			<>
				<Text>
					Le compte de{' '}
					<span className='bold-text'>{user.fullName}</span> a bien
					été créé.
				</Text>
				<Text>Le mot de passe à fournir est : </Text>
				<Flex
					gap='md'
					my='xl'
					mx='xl'
					justify='center'
					align='center'
					bg='passwordContainer'
					py='6'
					style={{ borderRadius: '5px' }}
				>
					<PasswordInput
						readOnly
						variant='unstyled'
						w={150}
						value={user.generatedPassword}
					/>
					<Tooltip label='Copier dans le presse-papiers'>
						<ActionIcon
							size={22}
							variant='subtle'
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
							size={22}
							variant='subtle'
							onClick={() =>
								sendEmail({
									sendTo: user.email,
									subject:
										'Création de votre compte sur Gestion-SMAC',
									content: `Bonjour ${user.fullName},
									
									Votre compte a été créé.

                                    Vous pouvez désormais vous connecter avec votre adresse mail et le mot de passe : ${user.generatedPassword}`,
								})
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

export default displayUserCreationConfirmModal;
