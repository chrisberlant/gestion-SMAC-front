import { Button, Input, LoadingOverlay, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';

interface ImportAgentsModalProps {
	openedAccountModal: boolean;
	closeAccountModal: () => void;
}

export default function ImportAgentsModal({
	openedAccountModal,
	closeAccountModal,
}: ImportAgentsModalProps) {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		initialValues: {
			file: '',
		},
		validate: {
			file: (value) =>
				value === '' ? 'Le fichier doit être renseigné' : null,
		},
	});
	// const { mutate: updateCurrentUser } = useUpdateCurrentUser(
	// 	form,
	// 	toggleOverlay,
	// 	closeAccountModal
	// );
	const closeModal = () => {
		closeAccountModal();
		form.reset();
		// Si des champs avaient été modifiés
		if (form.isDirty()) toast.warning("Aucun import n'a été effectué");
	};

	return (
		<div className='csv-import'>
			<Modal
				opened={openedAccountModal}
				onClose={closeModal}
				title="Importer des agents à partir d'un fichier"
				centered
				overlayProps={{
					blur: 3,
				}}
			>
				<form onSubmit={form.onSubmit(() => console.log(form.values))}>
					<LoadingOverlay
						visible={visible}
						zIndex={10}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<Input
						aria-label='Fichier à importer'
						type='file'
						name='file'
						{...form.getInputProps('file')}
						accept='.csv'
						mt='md'
						mb='xl'
					/>

					<Button fullWidth mt='md' type='submit'>
						Importer
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
		</div>
	);
}
