import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineCreationType, LineType } from '../types/line';
import { AgentType } from '../types/agent';

interface createLineProps {
	data: LineCreationType;
	updateDevice?: boolean;
}

interface displayDeviceAlreadyAffectedToAgentModalProps {
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

export function displayDeviceAlreadyAffectedToAgentModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	deviceFullName,
	agentFullName,
	creationData,
	currentOwner,
	currentOwnerFullName,
}: displayDeviceAlreadyAffectedToAgentModalProps) {
	return modals.open({
		title: 'Appareil déjà affecté à un autre agent',
		size: 'xl',
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
				<Flex align='center'>
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
				</Flex>
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

interface displayAutomaticAgentAffectationModalProps {
	createLine: ({ data, updateDevice }: createLineProps) => void;
	exitCreatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	deviceFullName: string;
	agentFullName: string | null;
	creationData: LineCreationType;
}

export function displayAutomaticAgentAffectationModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	deviceFullName,
	agentFullName,
	creationData,
}: displayAutomaticAgentAffectationModalProps) {
	return modals.openConfirmModal({
		title: "Affectation automatique de l'appareil",
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text>
					L'appareil {deviceFullName} n'a actuellement aucun
					propriétaire.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à l'agent{' '}
					<span className='bold-text'>{agentFullName}</span>.
				</Text>
			</>
		),
		labels: { confirm: 'Confirm', cancel: 'Cancel' },
		onCancel: modals.closeAll,
		onConfirm: () => {
			createLine({
				data: creationData,
				updateDevice: true,
			});
			setValidationErrors({});
			exitCreatingMode();
			modals.closeAll();
		},
	});
}

interface displayDeviceAlreadyAffectedToLineModalProps {
	createLine: ({ data, updateDevice }: createLineProps) => void;
	exitCreatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	alreadyUsingDeviceLine: LineType;
	deviceFullName: string;
	creationData: LineCreationType;
}

export function displayDeviceAlreadyAffectedToLineModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	alreadyUsingDeviceLine,
	deviceFullName,
	creationData,
}: displayDeviceAlreadyAffectedToLineModalProps) {
	return modals.openConfirmModal({
		title: 'Appareil déjà affecté à une autre ligne',
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text>
					L'appareil {deviceFullName} est actuellement affecté à la
					ligne {alreadyUsingDeviceLine.number}
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à la
					ligne{' '}
					<span className='bold-text'>{creationData.number}</span>.
				</Text>
			</>
		),
		labels: { confirm: 'Confirm', cancel: 'Cancel' },
		onCancel: modals.closeAll,
		onConfirm: () => {
			createLine({
				data: creationData,
			});
			setValidationErrors({});
			exitCreatingMode();
			modals.closeAll();
		},
	});
}
