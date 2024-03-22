import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImportAgentsModal from './ImportAgentsModal';

// Bouton permettant d'ouvrir la modale d'import de fichier
export default function CsvImportButton() {
	const [
		openedImportModal,
		{ open: openImportModal, close: closeImportModal },
	] = useDisclosure(false);

	return (
		<>
			<Button color='green' onClick={openImportModal}>
				Importer un CSV
			</Button>
			<ImportAgentsModal
				openedImportModal={openedImportModal}
				closeImportModal={closeImportModal}
			/>
		</>
	);
}
