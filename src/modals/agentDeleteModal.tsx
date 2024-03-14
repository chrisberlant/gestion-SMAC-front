import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { AgentType } from '../types/agent';

interface DisplayAgentDeleteModalProps {
	row: MRT_Row<AgentType>;
	deleteAgent: (id: number) => void;
}

const displayAgentDeleteModal = ({
	row,
	deleteAgent,
}: DisplayAgentDeleteModalProps) =>
	modals.openConfirmModal({
		title: "Suppression d'un agent",
		children: (
			<Text>
				Voulez-vous vraiment supprimer l'agent{' '}
				<span className='bold-text'>
					{row.original.firstName} {row.original.lastName}
				</span>{' '}
				? Cette action est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteAgent(row.original.id),
	});

export default displayAgentDeleteModal;
