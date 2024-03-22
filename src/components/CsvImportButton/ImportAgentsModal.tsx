import {
	Text,
	Button,
	FileInput,
	Group,
	HoverCard,
	LoadingOverlay,
	Modal,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import fileImportSchema from '../../validationSchemas/fileImportSchema';
import { IconQuestionMark, IconUpload } from '@tabler/icons-react';
import { useImportMultipleAgents } from '../../queries/agentQueries';
import { parseCsvToJson } from '../../utils/functions';

interface ImportAgentsModalProps {
	openedImportModal: boolean;
	closeImportModal: () => void;
}

// Modale permettant d'importer des agents depuis un CSV, ouverte depuis le composant CsvImportButton
export default function ImportAgentsModal({
	openedImportModal,
	closeImportModal,
}: ImportAgentsModalProps) {
	const iconUpload = <IconUpload style={{ height: 20 }} />;
	// Infos sur le format du fichier CSV à joindre
	const iconToolTip = (
		<Group justify='center'>
			<HoverCard width={280} shadow='md'>
				<HoverCard.Target>
					<IconQuestionMark style={{ height: 20 }} />
				</HoverCard.Target>
				<HoverCard.Dropdown>
					<Text>
						Le fichier doit contenir les en-têtes, en respectant les
						accents et majuscules :{' '}
						<span className='bold-text'>
							Email Nom Prenom VIP Service
						</span>
					</Text>
				</HoverCard.Dropdown>
			</HoverCard>
		</Group>
	);
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
				<form
					onSubmit={form.onSubmit(() =>
						parseCsvToJson(form.values.file, importAgents)
					)}
				>
					<LoadingOverlay
						visible={visible}
						zIndex={10}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/>
					<FileInput
						label='Sélectionner le fichier à importer'
						leftSection={iconUpload}
						rightSection={iconToolTip}
						placeholder='Sélectionner le fichier à importer'
						name='file'
						accept='.csv'
						mt='md'
						mb='xl'
						leftSectionPointerEvents='none'
						{...form.getInputProps('file')}
					/>
					<Button fullWidth mt='xl' type='submit'>
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
