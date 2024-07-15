import { Button, Tooltip } from '@mantine/core';
import { useGetCurrentUser } from '@/hooks/authQueries';
import { useDisclosure } from '@mantine/hooks';
import { ModelType } from '@customTypes/model';
import DeviceQuickAddModal from './DeviceQuickAddModal';
import { AgentType } from '@customTypes/agent';
import { IconDeviceMobilePlus } from '@tabler/icons-react';

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
			<Button mr='xl' disabled>
				<IconDeviceMobilePlus size={20} />
			</Button>
		) : (
			<>
				<Tooltip
					label="Ajout rapide d'un appareil"
					events={{ hover: true, focus: true, touch: false }}
					offset={10}
				>
					<Button onClick={openDeviceAddModal} mr='xl'>
						<IconDeviceMobilePlus size={20} />
					</Button>
				</Tooltip>
				<DeviceQuickAddModal
					models={models}
					agents={agents}
					openedDeviceAddModal={openedDeviceAddModal}
					closeDeviceAddModal={closeDeviceAddModal}
				/>
			</>
		);
}
