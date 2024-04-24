import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/userQueries';
import { useDisclosure } from '@mantine/hooks';
import { ModelType } from '@customTypes/model';
import DeviceQuickAddModal from './DeviceQuickAddModal';
import { AgentType } from '../../../types/agent';

interface DeviceQuickAddButtonProps {
	models?: ModelType[];
	agents?: AgentType[];
}

export default function DeviceQuickAddButton({
	models,
	agents,
}: DeviceQuickAddButtonProps) {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedDeviceAddModal,
		{ open: openDeviceAddModal, close: closeDeviceAddModal },
	] = useDisclosure(false);

	if (currentUser)
		return currentUser?.role === 'Consultant' ? (
			<Button mr='auto' ml='xs' disabled>
				Ajout rapide appareil
			</Button>
		) : (
			<>
				<Button onClick={openDeviceAddModal} mr='auto' ml='xs'>
					Ajout rapide appareil
				</Button>
				<DeviceQuickAddModal
					models={models}
					agents={agents}
					openedDeviceAddModal={openedDeviceAddModal}
					closeDeviceAddModal={closeDeviceAddModal}
				/>
			</>
		);
}
