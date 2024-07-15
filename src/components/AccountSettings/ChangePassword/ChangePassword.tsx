import { Button, LoadingOverlay, Modal, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { currentUserPasswordUpdateSchema } from '@/validationSchemas/userSchemas';
import { useDisclosure } from '@mantine/hooks';
import { useUpdateCurrentUserPassword } from '@/hooks/authQueries';
import { toast } from 'sonner';
import { PasswordInputStrength } from '../../PasswordInputStrength/PasswordInputStrength';

interface ChangePasswordProps {
	opened: boolean;
	closePasswordModal: () => void;
	openAccountModal: () => void;
}

export default function ChangePassword({
	opened,
	closePasswordModal,
	openAccountModal,
}: ChangePasswordProps) {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(currentUserPasswordUpdateSchema),
		initialValues: {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});
	const { mutate: updateCurrentUserPassword } = useUpdateCurrentUserPassword(
		form,
		toggleOverlay,
		closePasswordModal
	);
	const closeModals = () => {
		closePasswordModal();
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
					blur: 3,
				}}
			>
				<form
					onSubmit={form.onSubmit(() => updateCurrentUserPassword())}
				>
					<LoadingOverlay
						visible={visible}
						zIndex={2}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<PasswordInput
						data-autofocus
						label='Mot de passe actuel'
						placeholder='Votre mot de passe'
						{...form.getInputProps('oldPassword')}
						labelProps={{ mb: '4' }}
						mb='xs'
					/>
					<PasswordInputStrength form={form} field={'newPassword'} />
					<PasswordInput
						label='Confirmation nouveau mot de passe'
						placeholder='Confirmer le nouveau mot de passe'
						{...form.getInputProps('confirmPassword')}
						labelProps={{ mb: '4' }}
						mb='xl'
						mt={4}
					/>
					<Button fullWidth mt='md' type='submit'>
						Valider
					</Button>
					<Button
						fullWidth
						mt='md'
						color='gray'
						onClick={() => {
							form.reset();
							closePasswordModal();
							openAccountModal();
						}}
					>
						Retour
					</Button>
				</form>
			</Modal>
		</div>
	);
}
