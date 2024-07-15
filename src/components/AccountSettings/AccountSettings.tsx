import {
	ActionIcon,
	Button,
	Flex,
	LoadingOverlay,
	Modal,
	TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import { useGetCurrentUser, useUpdateCurrentUser } from '@/hooks/authQueries';
import { currentUserUpdateSchema } from '@/validationSchemas/userSchemas';
import ChangePassword from './ChangePassword/ChangePassword';
import { IconEdit, IconKey } from '@tabler/icons-react';
import { useState } from 'react';

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
			email: currentUser?.email ?? '',
			lastName: currentUser?.lastName ?? '',
			firstName: currentUser?.firstName ?? '',
		},
	});

	const { mutate: updateCurrentUser } = useUpdateCurrentUser(
		toggleOverlay,
		form,
		closeAccountModal
	);

	const [inputsLock, setInputLocks] = useState({
		email: true,
		lastName: true,
		firstName: true,
	});

	// En cas de fermeture de la modale par l'utilisateur
	const closeModalAndReset = () => {
		closeAccountModal();
		// Si des champs avaient été modifiés
		if (form.isDirty()) {
			form.reset();
			toast.warning("Les modifications n'ont pas été enregistrées");
		}
		setInputLocks({ email: true, lastName: true, firstName: true });
	};

	// Soumission du formulaire
	const handleSubmit = () => {
		setInputLocks({ email: true, lastName: true, firstName: true });
		if (!form.isDirty()) {
			closeAccountModal();
			return toast.warning('Aucune modification effectuée');
		}
		return updateCurrentUser();
	};

	return (
		currentUser && (
			<>
				<Modal
					opened={openedAccountModal}
					onClose={closeModalAndReset}
					title='Paramètres du compte'
					centered
					overlayProps={{
						blur: 3,
					}}
				>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<LoadingOverlay
							visible={visible}
							zIndex={2}
							overlayProps={{ radius: 'sm', blur: 2 }}
						/>
						<Flex direction='column' gap='xs'>
							<Flex align='flex-end' gap='md'>
								<ActionIcon
									aria-label="Modifier l'adresse mail"
									size='lg'
									color={inputsLock.email ? 'blue' : 'red'}
									mb={1}
									onClick={() =>
										setInputLocks((prev) => ({
											...prev,
											email: !prev.email,
										}))
									}
								>
									<IconEdit />
								</ActionIcon>
								<TextInput
									placeholder='Votre adresse mail'
									label='Adresse mail'
									labelProps={{ mb: '4' }}
									{...form.getInputProps('email')}
									{...(inputsLock.email
										? { disabled: true }
										: null)}
									flex={1}
								/>
							</Flex>
							<Flex align='flex-end' gap='md' mt='4'>
								<ActionIcon
									aria-label='Modifier le nom'
									size='lg'
									color={inputsLock.lastName ? 'blue' : 'red'}
									mb={1}
									onClick={() =>
										setInputLocks((prev) => ({
											...prev,
											lastName: !prev.lastName,
										}))
									}
								>
									<IconEdit />
								</ActionIcon>
								<TextInput
									placeholder='Votre nom'
									label='Votre nom'
									labelProps={{ mb: 4 }}
									{...form.getInputProps('lastName')}
									{...(inputsLock.lastName
										? { disabled: true }
										: null)}
									flex={1}
								/>
							</Flex>
							<Flex align='flex-end' gap='md' mt={4}>
								<ActionIcon
									aria-label='Modifier le prénom'
									size='lg'
									color={
										inputsLock.firstName ? 'blue' : 'red'
									}
									mb={1}
									onClick={() =>
										setInputLocks((prev) => ({
											...prev,
											firstName: !prev.firstName,
										}))
									}
								>
									<IconEdit />
								</ActionIcon>
								<TextInput
									placeholder='Votre prénom'
									label='Votre prénom'
									labelProps={{ mb: 4 }}
									{...form.getInputProps('firstName')}
									{...(inputsLock.firstName
										? { disabled: true }
										: null)}
									flex={1}
								/>
							</Flex>
						</Flex>

						<Button fullWidth mt='xl' type='submit'>
							Valider
						</Button>
						<Button
							fullWidth
							mt='md'
							onClick={() => {
								closeModalAndReset();
								setInputLocks({
									email: true,
									lastName: true,
									firstName: true,
								});
								openPasswordModal();
							}}
							leftSection={<IconKey size={20} />}
						>
							Modifier le mot de passe
						</Button>
						<Button
							fullWidth
							mt='md'
							color='gray'
							onClick={closeModalAndReset}
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
			</>
		)
	);
}
