import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/userQueries';
import { useDisclosure } from '@mantine/hooks';
import AgentQuickAddModal from './AgentQuickAddModal';
import { ServiceType } from '@customTypes/service';

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
			<Button mr='auto' ml='xs' disabled>
				Ajout rapide agent
			</Button>
		) : (
			<>
				<Button onClick={openAgentAddModal} mr='auto' ml='xs'>
					Ajout rapide agent
				</Button>
				<AgentQuickAddModal
					services={services}
					openedAgentAddModal={openedAgentAddModal}
					closeAgentAddModal={closeAgentAddModal}
				/>
			</>
		);
}
