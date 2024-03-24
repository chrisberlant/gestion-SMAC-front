import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImportModal from './ImportModal';

// Le modèle détermine la bonne modale à afficher
interface CsvImportButtonProps {
	model: string;
}

// Bouton permettant d'ouvrir la modale d'import de fichier
export default function CsvImportButton({ model }: CsvImportButtonProps) {
	const [
		openedImportModal,
		{ open: openImportModal, close: closeImportModal },
	] = useDisclosure(false);

	return (
		<>
			<Button color='green' onClick={openImportModal}>
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
