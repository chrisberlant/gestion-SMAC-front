import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/userQueries';
import { useDisclosure } from '@mantine/hooks';
import AgentAddModal from './AgentAddModal';
import { ServiceType } from '../../../types/service';

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
			<AgentAddModal
				services={services}
				openedAgentAddModal={openedAgentAddModal}
				closeAgentAddModal={closeAgentAddModal}
			/>
		</>
	);
}
