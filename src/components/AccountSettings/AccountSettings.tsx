import {
	ActionIcon,
	Button,
	Flex,
	InputLabel,
	LoadingOverlay,
	Modal,
	TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import { useGetCurrentUser, useUpdateCurrentUser } from '@queries/userQueries';
import { currentUserUpdateSchema } from '@validationSchemas/userSchemas';
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
			email: currentUser?.email || '',
			lastName: currentUser?.lastName || '',
			firstName: currentUser?.firstName || '',
		},
	});
	const { mutate: updateCurrentUser } = useUpdateCurrentUser(
		toggleOverlay,
		closeAccountModal
	);
	const closeModalAndReset = () => {
		closeAccountModal();
		// Si des champs avaient été modifiés
		if (form.isDirty())
			toast.warning("Les modifications n'ont pas été enregistrées");
		form.reset();
		setInputLocks({ email: true, lastName: true, firstName: true });
	};

	const [inputsLock, setInputLocks] = useState({
		email: true,
		lastName: true,
		firstName: true,
	});

	const handleSubmit = () => {
		if (!form.isDirty()) {
			closeModalAndReset();
			toast.warning('Aucune modification effectuée');
			return form.reset();
		}
		return updateCurrentUser(form.values);
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
							<InputLabel>
								Adresse mail
								<Flex align='center' gap='md' mt={4}>
									<ActionIcon
										aria-label="Modifier l'adresse mail"
										size='lg'
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
										placeholder='Votre email'
										{...form.getInputProps('email')}
										{...(inputsLock.email
											? { disabled: true }
											: null)}
										flex={1}
									/>
								</Flex>
							</InputLabel>
							<InputLabel>
								Nom
								<Flex align='center' gap='md' mt='4'>
									<ActionIcon
										aria-label='Modifier le nom'
										size='lg'
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
										{...form.getInputProps('lastName')}
										{...(inputsLock.lastName
											? { disabled: true }
											: null)}
										flex={1}
									/>
								</Flex>
							</InputLabel>
							<InputLabel>
								Prénom
								<Flex align='center' gap='md' mt={4}>
									<ActionIcon
										aria-label='Modifier le prénom'
										size='lg'
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
										{...form.getInputProps('firstName')}
										{...(inputsLock.firstName
											? { disabled: true }
											: null)}
										flex={1}
									/>
								</Flex>
							</InputLabel>
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
