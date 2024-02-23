import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineUpdateType, LineType } from '../types/line';

// interface UpdateLineProps {
// 	data: LineUpdateType;
// 	updateDevice?: boolean;
// 	updateOldLine?: boolean;
// }

interface DisplayLineUpdateModalProps {
	updateLine: (data: LineUpdateType) => void;
	exitUpdatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	alreadyUsingDeviceLine: LineType | null;
	deviceFullName: string | null;
	currentLineOwnerFullName: string | null;
	currentLineOwnerId: number | null;
	newLineOwnerFullName: string | null;
	newLineOwnerId: number | null;
	currentDeviceId: number | null;
	newDeviceId: number | null;
	updateData: LineUpdateType;
}

export default function displayLineUpdateModal({
	updateLine,
	exitUpdatingMode,
	setValidationErrors,
	alreadyUsingDeviceLine,
	deviceFullName,
	currentLineOwnerFullName,
	currentLineOwnerId,
	newLineOwnerFullName,
	newLineOwnerId,
	currentDeviceId,
	newDeviceId,
	updateData,
}: DisplayLineUpdateModalProps) {
	// Si un appareil est fourni et qu'il n'a pas changé
	if (newDeviceId && newDeviceId === currentDeviceId) {
		// Si le propriétaire actuel est différent de l'ancien
		if (currentLineOwnerId !== newLineOwnerId) {
			// Si un nouveau propriétaire mais pas d'ancien
			if (!currentLineOwnerId) {
				return modals.openConfirmModal({
					title: "Changement de propriétaire de l'appareil",
					size: 'lg',
					centered: true,
					children: (
						<>
							<Text mb='xs'>
								L'appareil {deviceFullName} n'appartient
								actuellement à aucun agent.
							</Text>
							<Text mb='xl'>
								Si vous continuez, il sera affecté à l'agent{' '}
								<span className='bold-text'>
									{newLineOwnerFullName}
								</span>
								.
							</Text>
						</>
					),
					labels: { confirm: 'Confirmer', cancel: 'Annuler' },
					onCancel: modals.closeAll,
					onConfirm: () => {
						updateLine(updateData);
						setValidationErrors({});
						exitUpdatingMode();
						modals.closeAll();
					},
				});
			}
			// Pas de nouveau propriétaire mais un ancien
			if (!newLineOwnerId) {
				return modals.open({
					title: 'Appareil actuellement affecté à un agent',
					size: 'xl',
					centered: true,
					children: (
						<>
							<Text mb='xs'>
								L'appareil {deviceFullName} appartient
								actuellement à l'agent{' '}
								<span className='bold-text'>
									{currentLineOwnerFullName}
								</span>
								.
							</Text>
							<Text>Que souhaitez-vous faire ?</Text>
							<Flex align='center'>
								<Button
									mt='lg'
									mx='md'
									onClick={() => {
										updateData.agentId = currentLineOwnerId;
										updateLine(updateData);
										setValidationErrors({});
										exitUpdatingMode();
										modals.closeAll();
									}}
								>
									Affecter la ligne à{' '}
									{currentLineOwnerFullName}
								</Button>
								<Button
									mt='lg'
									mx='md'
									color='rgba(68, 145, 42, 1)'
									onClick={() => {
										updateLine(updateData);
										setValidationErrors({});
										exitUpdatingMode();
										modals.closeAll();
									}}
								>
									Désaffecter l'appareil
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

			// Si l'ancien et le nouveau propriétaire sont différents (non nuls)
			return modals.openConfirmModal({
				title: "Changement de propriétaire de l'appareil",
				size: 'lg',
				centered: true,
				children: (
					<>
						<Text mb='xs'>
							L'appareil {deviceFullName} appartient actuellement
							à l'agent{' '}
							<span className='bold-text'>
								{currentLineOwnerFullName}
							</span>{' '}
							.
						</Text>
						<Text mb='xl'>
							Si vous continuez, il sera affecté à l'agent{' '}
							<span className='bold-text'>
								{newLineOwnerFullName}
							</span>
							.
						</Text>
					</>
				),
				labels: { confirm: 'Confirmer', cancel: 'Annuler' },
				onCancel: modals.closeAll,
				onConfirm: () => {
					updateLine(updateData);
					setValidationErrors({});
					exitUpdatingMode();
					modals.closeAll();
				},
			});
		}
	}
}
