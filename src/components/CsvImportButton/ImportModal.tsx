import {
	Text,
	Button,
	FileInput,
	HoverCard,
	LoadingOverlay,
	Modal,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import fileImportSchema from '@validationSchemas/fileImportSchema';
import { IconQuestionMark, IconUpload } from '@tabler/icons-react';
import {
	useGetAgentsCsvTemplate,
	useImportMultipleAgents,
} from '@queries/agentQueries';
import { parseCsvToJson } from '@utils/index';
import { UseMutateFunction } from '@tanstack/react-query';
import {
	useGetDevicesCsvTemplate,
	useImportMultipleDevices,
} from '@queries/deviceQueries';
import {
	useGetLinesCsvTemplate,
	useImportMultipleLines,
} from '@queries/lineQueries';

interface ImportModalProps {
	model: string;
	openedImportModal: boolean;
	closeImportModal: () => void;
}

// Modale permettant d'importer des agents depuis un CSV, ouverte depuis le composant CsvImportButton
export default function ImportModal({
	model,
	openedImportModal,
	closeImportModal,
}: ImportModalProps) {
	const iconUpload = <IconUpload size={20} />;

	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const form = useForm({
		validate: zodResolver(fileImportSchema),
		initialValues: {
			file: '',
		},
	});

	const closeModal = () => {
		closeImportModal();
		form.reset();
		// Si des champs avaient été modifiés
		if (form.isDirty()) toast.warning("Aucun import n'a été effectué");
	};

	// Import de fichier
	const { mutate: importAgents } = useImportMultipleAgents(
		toggleOverlay,
		closeImportModal
	);
	const { mutate: importDevices } = useImportMultipleDevices(
		toggleOverlay,
		closeImportModal
	);
	const { mutate: importLines } = useImportMultipleLines(
		toggleOverlay,
		closeImportModal
	);

	// Génération de template
	const { refetch: generateAgentsCsvTemplate } = useGetAgentsCsvTemplate();
	const { refetch: generateDevicesCsvTemplate } = useGetDevicesCsvTemplate();
	const { refetch: generateLinesCsvTemplate } = useGetLinesCsvTemplate();

	const options: {
		title: string;
		requiredCsvHeaders: string;
		mutationFn: UseMutateFunction<unknown, Error, object[], void>;
		templateGenerationFn: () => void;
	} = {
		title: '',
		requiredCsvHeaders: '',
		mutationFn: () => null,
		templateGenerationFn: () => null,
	};
	let { title, requiredCsvHeaders, mutationFn, templateGenerationFn } =
		options;

	// Selon le modèle fourni, les requêtes et informations de la modale seront différentes
	switch (model) {
		case 'agents':
			title = "Importer des agents à partir d'un fichier";
			requiredCsvHeaders = 'Email Nom Prénom VIP Service';
			mutationFn = importAgents;
			templateGenerationFn = generateAgentsCsvTemplate;
			break;
		case 'devices':
			title = "Importer des appareils à partir d'un fichier";
			requiredCsvHeaders =
				'IMEI Statut État Modèle Propriétaire Préparation Attribution Commentaires';
			mutationFn = importDevices;
			templateGenerationFn = generateDevicesCsvTemplate;
			break;
		case 'lines':
			title = "Importer des lignes à partir d'un fichier";
			requiredCsvHeaders =
				'Numéro Profil Statut Propriétaire Appareil Commentaires';
			mutationFn = importLines;
			templateGenerationFn = generateLinesCsvTemplate;
	}

	// Infos sur le format du fichier CSV à joindre
	const tooltipIcon = (
		<HoverCard width={400} shadow='md'>
			<HoverCard.Target>
				<IconQuestionMark size={20} />
			</HoverCard.Target>
			<HoverCard.Dropdown>
				<Text>
					Le fichier doit être au format UTF-8 et contenir les
					en-têtes, en respectant les accents et majuscules :{' '}
					<span className='bold-text'>{requiredCsvHeaders}</span>
				</Text>
			</HoverCard.Dropdown>
		</HoverCard>
	);

	return (
		<div className='csv-import'>
			<Modal
				opened={openedImportModal}
				onClose={closeModal}
				title={title}
				centered
				overlayProps={{
					blur: 3,
				}}
			>
				<form
					onSubmit={form.onSubmit(() =>
						parseCsvToJson(form.values.file, mutationFn)
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
						rightSection={tooltipIcon}
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
						color='orange'
						fullWidth
						mt='md'
						onClick={templateGenerationFn}
					>
						Télécharger un template vierge
					</Button>
					<Button
						fullWidth
						mt='md'
						color='gray'
						onClick={closeImportModal}
					>
						Annuler
					</Button>
				</form>
			</Modal>
		</div>
	);
}
