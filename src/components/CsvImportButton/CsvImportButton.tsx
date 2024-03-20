import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImportAgentsModal from './ImportAgentsModal';

export default function CsvImportButton() {
	const [
		openedAccountModal,
		{ open: openAccountModal, close: closeAccountModal },
	] = useDisclosure(false);

	return (
		<>
			<Button color='green' onClick={openAccountModal}>
				Importer un CSV
			</Button>
			<ImportAgentsModal
				openedAccountModal={openedAccountModal}
				closeAccountModal={closeAccountModal}
			/>
		</>
	);
}
