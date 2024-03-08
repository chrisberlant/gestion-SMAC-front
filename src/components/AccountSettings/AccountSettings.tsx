import { Button, LoadingOverlay, Modal, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import {
	useGetCurrentUser,
	useUpdateCurrentUser,
} from '../../queries/userQueries';
import { currentUserUpdateSchema } from '../../validationSchemas/userSchemas';
import ChangePassword from './ChangePassword/ChangePassword';

interface AccountSettingsProps {
	openedAccountModal: boolean;
	openAccountModal: () => void;
	closeAccountModal: () => void;
}

export default function AccountSettings({
	openedAccountModal,
	openAccountModal,
	closeAccountModal,
}: AccountSettingsProps) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedPasswordModal,
		{ open: openPasswordModal, close: closePasswordModal },
	] = useDisclosure(false);
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(currentUserUpdateSchema),
		initialValues: {
			email: currentUser?.email || '',
			lastName: currentUser?.lastName || '',
			firstName: currentUser?.firstName || '',
		},
	});
	const { mutate: updateCurrentUser } = useUpdateCurrentUser(
		form,
		toggleOverlay,
		closeAccountModal
	);
	const closeModal = () => {
		closeAccountModal();
		form.reset();
		// Si des champs avaient été modifiés
		if (form.isDirty())
			toast.warning("Les modifications n'ont pas été enregistrées");
	};

	return (
		<div className='account-settings'>
			<Modal
				opened={openedAccountModal}
				onClose={closeModal}
				title='Paramètres du compte'
				centered
				overlayProps={{
					blur: 3,
				}}
			>
				<form onSubmit={form.onSubmit(() => updateCurrentUser())}>
					<LoadingOverlay
						visible={visible}
						zIndex={10}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<TextInput
						label='Adresse mail'
						placeholder='Votre email'
						data-autofocus
						{...form.getInputProps('email')}
						mb='xs'
					/>
					<TextInput
						label='Nom'
						placeholder='Votre nom'
						{...form.getInputProps('lastName')}
						mb='xs'
					/>
					<TextInput
						label='Prénom'
						placeholder='Votre prénom'
						{...form.getInputProps('firstName')}
						mb='xl'
					/>

					<Button fullWidth mt='md' type='submit'>
						Valider
					</Button>
					<Button
						fullWidth
						mt='md'
						onClick={() => {
							closeAccountModal();
							openPasswordModal();
						}}
					>
						Modifier le mot de passe
					</Button>
					<Button
						fullWidth
						mt='md'
						color='grey'
						onClick={closeAccountModal}
					>
						Annuler
					</Button>
				</form>
			</Modal>
			<ChangePassword
				opened={openedPasswordModal}
				closePasswordModal={closePasswordModal}
				openAccountModal={openAccountModal}
			/>
		</div>
	);
}
