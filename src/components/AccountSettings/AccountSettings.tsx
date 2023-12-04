import { TextInput, Button, LoadingOverlay, Modal } from '@mantine/core';
import {
	useGetCurrentUser,
	useModifyCurrentUser,
} from '../../utils/userQueries';
import { useForm, zodResolver } from '@mantine/form';
import { currentUserModificationSchema } from '../../validationSchemas/userSchemas';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import ChangePassword from './ChangePassword/ChangePassword';

interface AccountSettingsProps {
	openedAccountModal: boolean;
	closeAccountModal: () => void;
}

function AccountSettings({
	openedAccountModal,
	closeAccountModal,
}: AccountSettingsProps) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedPasswordModal,
		{ open: openPasswordModal, close: closePasswordModal },
	] = useDisclosure(false);
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(currentUserModificationSchema),
		initialValues: {
			email: currentUser?.email || '',
			lastName: currentUser?.lastName || '',
			firstName: currentUser?.firstName || '',
		},
	});
	const { mutate: modifyCurrentUser } = useModifyCurrentUser(
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
				<form onSubmit={form.onSubmit(() => modifyCurrentUser())}>
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
					/>
					<TextInput
						label='Nom'
						placeholder='Votre nom'
						{...form.getInputProps('lastName')}
					/>
					<TextInput
						label='Prénom'
						placeholder='Votre prénom'
						{...form.getInputProps('firstName')}
						mb='xl'
					/>

					<Button fullWidth mt='xl' type='submit'>
						Valider
					</Button>
					<Button
						fullWidth
						mt='xl'
						color='cyan'
						onClick={openPasswordModal}
					>
						Modifier le mot de passe
					</Button>
				</form>
			</Modal>
			<ChangePassword
				opened={openedPasswordModal}
				closePasswordModal={closePasswordModal}
				closeAccountModal={closeAccountModal}
			/>
		</div>
	);
}

export default AccountSettings;
