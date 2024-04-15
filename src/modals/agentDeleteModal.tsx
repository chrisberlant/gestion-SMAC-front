import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';

interface DisplayAgentDeleteModalProps {
	agentId: number;
	agentFullName: string;
	deleteAgent: (id: number) => void;
}

const displayAgentDeleteModal = ({
	agentId,
	agentFullName,
	deleteAgent,
}: DisplayAgentDeleteModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un agent",
		size: 'lg',
		children: (
			<>
				<Text mb='xs'>
					Voulez-vous vraiment supprimer l'agent{' '}
					<span className='bold-text'>{agentFullName}</span> ?
				</Text>
				<Text mb='xs'>Cette action est irréversible.</Text>
			</>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteAgent(agentId),
	});

export default displayAgentDeleteModal;
