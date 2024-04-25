import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImportModal from './ImportModal';
import { useGetCurrentUser } from '@queries/userQueries';
import { IconFileUpload } from '@tabler/icons-react';

// Bouton permettant d'ouvrir la modale d'import de fichier, model permet de déterminer le type de modale à afficher
export default function CsvImportButton({ model }: { model: string }) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedImportModal,
		{ open: openImportModal, close: closeImportModal },
	] = useDisclosure(false);

	return currentUser?.role === 'Consultant' ? (
		<Button disabled>Importer un CSV</Button>
	) : (
		<>
			<Button
				leftSection={<IconFileUpload size={20} />}
				color='green'
				onClick={openImportModal}
			>
				Importer un CSV
			</Button>
			<ImportModal
				model={model}
				openedImportModal={openedImportModal}
				closeImportModal={closeImportModal}
			/>
		</>
	);
}
