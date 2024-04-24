import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/userQueries';
import { useDisclosure } from '@mantine/hooks';
import AgentQuickAddModal from './AgentQuickAddModal';
import { ServiceType } from '@customTypes/service';

interface QuickAddAgentButtonProps {
	services?: ServiceType[];
}

export default function QuickAddAgentButton({
	services,
}: QuickAddAgentButtonProps) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedAgentAddModal,
		{ open: openAgentAddModal, close: closeAgentAddModal },
	] = useDisclosure(false);

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
