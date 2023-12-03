import { Button, LoadingOverlay, Modal, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { passwordModificationSchema } from '../../../validationSchemas/userSchemas';
import { useDisclosure } from '@mantine/hooks';

interface ChangePasswordProps {
	opened: boolean;
	close: () => void;
}

function ChangePassword({ opened, close }: ChangePasswordProps) {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(passwordModificationSchema),
		initialValues: {
			oldPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});
	// TODO create mutation
	return (
		<div className='change-password'>
			<Modal
				opened={opened}
				onClose={close}
				title='Changement du mot de passe'
				centered
				overlayProps={{
					backgroundOpacity: 0,
				}}
			>
				<form onSubmit={form.onSubmit(() => console.log(''))}>
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
						onClick={() => close()}
					>
						Retour
					</Button>
				</form>
			</Modal>
		</div>
	);
}
export default ChangePassword;
