import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImportModal from './ImportModal';
import { useGetCurrentUser } from '@queries/userQueries';

// Bouton permettant d'ouvrir la modale d'import de fichier, model permet de déterminer le type de modale à afficher
export default function CsvImportButton({ model }: { model: string }) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedImportModal,
		{ open: openImportModal, close: closeImportModal },
	] = useDisclosure(false);

	if (currentUser)
		return currentUser.role === 'Consultant' ? (
			<Button
				color='#B2B2B2'
				style={{
					cursor: 'not-allowed',
				}}
			>
				Importer un CSV
			</Button>
		) : (
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
