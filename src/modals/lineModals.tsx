import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineCreationType } from '../types/line';
import { AgentType } from '../types/agent';

interface createLineProps {
	data: LineCreationType;
	updateDevice?: boolean;
}

interface alreadyAffectedDeviceModalProps {
	createLine: ({ data, updateDevice }: createLineProps) => void;
	exitCreatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	deviceFullName: string;
	agentFullName: string | null;
	creationData: LineCreationType;
	currentOwner: AgentType | undefined;
	currentOwnerFullName: string;
}

export function alreadyAffectedDeviceModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	deviceFullName,
	agentFullName,
	creationData,
	currentOwner,
	currentOwnerFullName,
}: alreadyAffectedDeviceModalProps) {
	return modals.open({
		title: 'Appareil déjà affecté à un autre agent',
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text>
					L'appareil {deviceFullName} appartient déjà à l'agent{' '}
					<span className='bold-text'>currentOwnerFullName</span>.
				</Text>
				<Text>
					Voulez-vous le réaffecter à{' '}
					<span className='bold-text'>{agentFullName} </span>?
				</Text>
				<Button
					mt='lg'
					mx='md'
					onClick={() => {
						creationData.agentId = currentOwner?.id;
						createLine({
							data: creationData,
						});
						setValidationErrors({});
						exitCreatingMode();
						modals.closeAll();
					}}
				>
					Le laisser affecté à {currentOwnerFullName}
				</Button>
				<Button
					mt='lg'
					mx='md'
					color='rgba(68, 145, 42, 1)'
					onClick={() => {
						createLine({
							data: creationData,
							updateDevice: true,
						});
						setValidationErrors({});
						exitCreatingMode();
						modals.closeAll();
					}}
				>
					Confirmer la réaffectation à {agentFullName}
				</Button>
				<Button
					fullWidth
					mt='xl'
					variant='default'
					onClick={() => modals.closeAll()}
				>
					Annuler
				</Button>
			</>
		),
	});
}
