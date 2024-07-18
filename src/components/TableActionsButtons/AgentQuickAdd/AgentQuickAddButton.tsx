import { Button, Tooltip } from '@mantine/core';
import { useGetCurrentUser } from '@/hooks/authQueries';
import { useDisclosure } from '@mantine/hooks';
import AgentQuickAddModal from './AgentQuickAddModal';
import { ServiceType } from '@/types/service';
import { IconUserPlus } from '@tabler/icons-react';

interface AgentQuickAddButtonProps {
	services?: ServiceType[];
}

export default function AgentQuickAddButton({
	services,
}: AgentQuickAddButtonProps) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedAgentAddModal,
		{ open: openAgentAddModal, close: closeAgentAddModal },
	] = useDisclosure(false);

	if (currentUser)
		return currentUser?.role === 'Consultant' ? (
			<Button mr='xl' disabled>
				<IconUserPlus size={20} />
			</Button>
		) : (
			<>
				<Tooltip
					label="Ajout rapide d'un agent"
					events={{ hover: true, focus: true, touch: false }}
					offset={10}
				>
					<Button onClick={openAgentAddModal} mr='xl'>
						<IconUserPlus size={20} />
					</Button>
				</Tooltip>
				<AgentQuickAddModal
					services={services}
					openedAgentAddModal={openedAgentAddModal}
					closeAgentAddModal={closeAgentAddModal}
				/>
			</>
		);
}
