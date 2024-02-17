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
	currentOwnerFullName: string;
}

export function displayDeviceAlreadyAffectedToAgentModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	deviceFullName,
	agentFullName,
	creationData,
	currentOwnerFullName,
}: displayDeviceAlreadyAffectedToAgentModalProps) {
	return modals.open({
		title: 'Appareil déjà affecté à un autre agent',
		size: 'xl',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {deviceFullName} appartient déjà à l'agent{' '}
					<span className='bold-text'>{currentOwnerFullName}</span>.
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
							createLine({
								data: creationData,
							});
							setValidationErrors({});
							exitCreatingMode();
							modals.closeAll();
						}}
					>
						Affecter la ligne au propriétaire actuel{' '}
						{currentOwnerFullName}
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
				<Text mb='xs'>
					L'appareil {deviceFullName} n'a actuellement aucun
					propriétaire.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à l'agent{' '}
					<span className='bold-text'>{agentFullName}</span>.
				</Text>
			</>
		),
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
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
	currentLineOwnerFullName: string | null;
	newLineOwnerFullName: string | null;
	creationData: LineCreationType;
}

export function displayDeviceAlreadyAffectedToLineModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	alreadyUsingDeviceLine,
	deviceFullName,
	currentLineOwnerFullName,
	newLineOwnerFullName,
	creationData,
}: displayDeviceAlreadyAffectedToLineModalProps) {
	return modals.openConfirmModal({
		title: 'Appareil déjà affecté à une autre ligne',
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {deviceFullName} est actuellement affecté à la
					ligne{' '}
					<span className='bold-text'>
						{alreadyUsingDeviceLine.number}
					</span>
					{currentLineOwnerFullName ? (
						<>
							{' '}
							de l'agent{' '}
							<span className='bold-text'>
								{currentLineOwnerFullName}
							</span>
						</>
					) : (
						<> sans propriétaire</>
					)}
					.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à la
					ligne{' '}
					<span className='bold-text'>{creationData.number}</span> et
					à son propriétaire{' '}
					<span className='bold-text'>{newLineOwnerFullName}</span>.
				</Text>
			</>
		),
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
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

interface displayDeviceAlreadyAffectedToAgentLineModalProps {
	createLine: ({ data, updateDevice }: createLineProps) => void;
	exitCreatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	alreadyUsingDeviceLine: LineType;
	deviceFullName: string;
	lineOwnerFullName: string;
	creationData: LineCreationType;
}

export function displayDeviceAlreadyAffectedToAgentLineModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	alreadyUsingDeviceLine,
	deviceFullName,
	lineOwnerFullName,
	creationData,
}: displayDeviceAlreadyAffectedToAgentLineModalProps) {
	return modals.openConfirmModal({
		title: "Appareil déjà affecté à une autre ligne appartenant à l'agent",
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {deviceFullName} est actuellement affecté à la
					ligne{' '}
					<span className='bold-text'>
						{alreadyUsingDeviceLine.number}
					</span>{' '}
					de l'agent{' '}
					<span className='bold-text'>{lineOwnerFullName}</span>.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera désaffecté de la ligne{' '}
					<span className='bold-text'>{creationData.number}</span>, le
					propriétaire restera inchangé.
				</Text>
			</>
		),
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
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

interface displayDeviceHasOwnerModalProps {
	createLine: ({ data, updateDevice }: createLineProps) => void;
	exitCreatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	deviceFullName: string;
	currentOwnerFullName: string;
	creationData: LineCreationType;
}

export function displayDeviceHasOwnerModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	deviceFullName,
	currentOwnerFullName,
	creationData,
}: displayDeviceHasOwnerModalProps) {
	return modals.openConfirmModal({
		title: "Affectation automatique de l'appareil",
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {deviceFullName} appartient actuellement à
					l'agent {currentOwnerFullName}.
				</Text>
				<Text mb='xl'>
					Vous n'avez pas défini de propriétaire de la ligne. Si vous
					continuez, celle-ci lui sera automatiquement affectée.
				</Text>
			</>
		),
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
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
