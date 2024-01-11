import { Button, LoadingOverlay, Modal, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { currentUserPasswordModificationSchema } from '../../../validationSchemas/userSchemas';
import { useDisclosure } from '@mantine/hooks';
import { useUpdateCurrentUserPassword } from '../../../utils/userQueries';
import { toast } from 'sonner';

interface ChangePasswordProps {
	opened: boolean;
	closePasswordModal: () => void;
	closeAccountModal: () => void;
}

function ChangePassword({
	opened,
	closePasswordModal,
	closeAccountModal,
}: ChangePasswordProps) {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(currentUserPasswordModificationSchema),
		initialValues: {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});
	const { mutate: updateCurrentUserPassword } = useUpdateCurrentUserPassword(
		form,
		toggleOverlay,
		closePasswordModal,
		closeAccountModal
	);
	const closeModals = () => {
		closePasswordModal();
		closeAccountModal();
		form.reset();
		// Si des champs avaient été modifiés
		if (form.isDirty())
			toast.warning("Les modifications n'ont pas été enregistrées");
	};

	return (
		<div className='change-password'>
			<Modal
				opened={opened}
				onClose={closeModals}
				title='Changement du mot de passe'
				centered
				overlayProps={{
					backgroundOpacity: 0,
				}}
			>
				<form
					onSubmit={form.onSubmit(() => updateCurrentUserPassword())}
				>
					<LoadingOverlay
						visible={visible}
						zIndex={10}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<PasswordInput
						label='Mot de passe actuel'
						placeholder='Votre mot de passe'
						data-autofocus
						{...form.getInputProps('oldPassword')}
					/>
					<PasswordInput
						label='Nouveau mot de passe'
						placeholder='Votre nouveau mot de passe'
						{...form.getInputProps('newPassword')}
					/>
					<PasswordInput
						label='Confirmation nouveau mot de passe'
						placeholder='Confirmer le nouveau mot de passe'
						{...form.getInputProps('confirmPassword')}
						mb='xl'
					/>
					<Button fullWidth mt='xl' type='submit'>
						Valider
					</Button>
					<Button
						fullWidth
						mt='xl'
						color='grey'
						onClick={closePasswordModal}
					>
						Retour
					</Button>
				</form>
			</Modal>
		</div>
	);
}
export default ChangePassword;
