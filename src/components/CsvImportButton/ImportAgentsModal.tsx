import { Button, FileInput, LoadingOverlay, Modal } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import fileImportSchema from '../../validationSchemas/fileImportSchema';
import { IconUpload } from '@tabler/icons-react';
import { useImportMultipleAgents } from '../../queries/agentQueries';
import Papa from 'papaparse';
import { AgentCreationType } from '../../types/agent';
import { json } from 'react-router-dom';

interface ImportAgentsModalProps {
	openedImportModal: boolean;
	closeImportModal: () => void;
}

export default function ImportAgentsModal({
	openedImportModal,
	closeImportModal,
}: ImportAgentsModalProps) {
	const iconUpload = <IconUpload style={{ height: 20 }} />;
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(fileImportSchema),
		initialValues: {
			file: '',
		},
	});
	const { mutate: importAgents } = useImportMultipleAgents(
		toggleOverlay,
		closeImportModal
	);
	const closeModal = () => {
		closeImportModal();
		form.reset();
		// Si des champs avaient été modifiés
		if (form.isDirty()) toast.warning("Aucun import n'a été effectué");
	};

	const parseCsvToJson = (file: string, callback: (data: object) => void) => {
		Papa.parse(file, {
			header: true,
			complete: (results) => callback(results.data),
		});
	};

	return (
		<div className='csv-import'>
			<Modal
				opened={openedImportModal}
				onClose={closeModal}
				title="Importer des agents à partir d'un fichier"
				centered
				overlayProps={{
					blur: 3,
				}}
			>
				// TODO fix erreurs de type
				<form
					onSubmit={form.onSubmit(() => {
						parseCsvToJson(form.values.file, importAgents);
					})}
				>
					<LoadingOverlay
						visible={visible}
						zIndex={10}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<FileInput
						label='Sélectionner le fichier à importer'
						leftSection={iconUpload}
						placeholder='Fichier'
						name='file'
						accept='.csv'
						mt='md'
						mb='xl'
						{...form.getInputProps('file')}
					/>

					<Button fullWidth mt='md' type='submit'>
						Importer
					</Button>
					<Button
						fullWidth
						mt='md'
						color='grey'
						onClick={closeImportModal}
					>
						Annuler
					</Button>
				</form>
			</Modal>
		</div>
	);
}
