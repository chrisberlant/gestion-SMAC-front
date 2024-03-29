import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineType } from '@customTypes/line';

interface UpdateLineProps {
	data: LineType;
	updateDevice?: boolean;
	updateOldLine?: boolean;
}

interface DisplayLineUpdateModalProps {
	updateLine: ({
		data,
		updateDevice,
		updateOldLine,
	}: UpdateLineProps) => void;
	exitUpdatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	alreadyUsingDeviceLine: LineType | null;
	alreadyUsingDeviceLineOwnerFullName: string | null;
	deviceFullName: string | null;
	currentLineOwnerId: number | null;
	newLineOwnerFullName: string | null;
	newLineOwnerId: number | null;
	currentDeviceId: number | null;
	deviceCurrentOwnerId: number | null;
	deviceCurrentOwnerFullName: string | null;
	newDeviceId: number | null;
	data: LineType;
}

export default function displayLineUpdateModal({
	updateLine,
	exitUpdatingMode,
	setValidationErrors,
	alreadyUsingDeviceLine,
	alreadyUsingDeviceLineOwnerFullName,
	deviceFullName,
	currentLineOwnerId,
	newLineOwnerFullName,
	newLineOwnerId,
	currentDeviceId,
	newDeviceId,
	deviceCurrentOwnerId,
	deviceCurrentOwnerFullName,
	data,
}: DisplayLineUpdateModalProps) {
	// Si l'appareil n'a pas été changé
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
						updateLine({ data, updateDevice: true });
						setValidationErrors({});
						exitUpdatingMode();
						modals.closeAll();
					},
				});
			}
			// Retrait du propriétaire existant de la ligne
			if (!newLineOwnerId) {
				return modals.openConfirmModal({
					title: "Changement de propriétaire de l'appareil",
					size: 'lg',
					centered: true,
					children: (
						<>
							<Text mb='xs'>
								L'appareil {deviceFullName} appartient
								actuellement à l'agent{' '}
								<span className='bold-text'>
									{deviceCurrentOwnerFullName}
								</span>
								.
							</Text>
							<Text mb='xl'>
								Si vous continuez, celui-ci sera désaffecté.
							</Text>
						</>
					),
					labels: { confirm: 'Confirmer', cancel: 'Annuler' },
					onCancel: modals.closeAll,
					onConfirm: () => {
						updateLine({ data, updateDevice: true });
						setValidationErrors({});
						exitUpdatingMode();
						modals.closeAll();
					},
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
								{deviceCurrentOwnerFullName}
							</span>
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
					updateLine({ data, updateDevice: true });
					setValidationErrors({});
					exitUpdatingMode();
					modals.closeAll();
				},
			});
		}
	}

	// Si l'appareil a été modifié

	// Si l'appareil est déjà associé à une autre ligne
	if (alreadyUsingDeviceLine) {
		// Si l'autre ligne a le même propriétaire que la ligne actuelle (peuvent être nuls)
		if (alreadyUsingDeviceLine.agentId === newLineOwnerId) {
			return modals.openConfirmModal({
				title: "Appareil déjà associé à une autre ligne de l'agent",
				size: 'lg',
				centered: true,
				children: (
					<>
						<Text mb='xs'>
							L'appareil {deviceFullName} est actuellement affecté
							à la ligne{' '}
							<span className='bold-text'>
								{alreadyUsingDeviceLine.number}
							</span>{' '}
							{alreadyUsingDeviceLineOwnerFullName ? (
								<>
									de l'agent{' '}
									<span className='bold-text'>
										{alreadyUsingDeviceLineOwnerFullName}
									</span>
								</>
							) : (
								'sans propriétaire'
							)}
							.
						</Text>
						<Text mb='xl'>
							Si vous continuez, il sera désaffecté de celle-ci
							pour être affecté à la ligne en cours de
							modification.
						</Text>
					</>
				),
				labels: { confirm: 'Confirmer', cancel: 'Annuler' },
				onCancel: modals.closeAll,
				onConfirm: () => {
					updateLine({ data, updateOldLine: true });
					setValidationErrors({});
					exitUpdatingMode();
					modals.closeAll();
				},
			});
		}
		// Si l'autre ligne possède un propriétaire différent
		return modals.openConfirmModal({
			title: alreadyUsingDeviceLine.agentId
				? "Appareil déjà associé à une ligne d'un autre agent"
				: 'Appareil déjà associé à une ligne sans propriétaire',
			size: 'lg',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil {deviceFullName} est actuellement affecté à
						la ligne{' '}
						<span className='bold-text'>
							{alreadyUsingDeviceLine.number}
						</span>{' '}
						{alreadyUsingDeviceLineOwnerFullName ? (
							<>
								et à son propriétaire{' '}
								<span className='bold-text'>
									{alreadyUsingDeviceLineOwnerFullName}
								</span>
							</>
						) : (
							'sans propriétaire'
						)}
						.
					</Text>
					<Text mb='xl'>
						Si vous continuez, il sera désaffecté de ceux-ci pour
						être affecté à la ligne en cours de modification{' '}
						{newLineOwnerFullName ? (
							<>
								et à son propriétaire{' '}
								<span className='bold-text'>
									{newLineOwnerFullName}
								</span>
							</>
						) : (
							'sans propriétaire'
						)}
						.
					</Text>
				</>
			),
			labels: { confirm: 'Confirmer', cancel: 'Annuler' },
			onCancel: modals.closeAll,
			onConfirm: () => {
				updateLine({
					data,
					updateDevice: true,
					updateOldLine: true,
				});
				setValidationErrors({});
				exitUpdatingMode();
				modals.closeAll();
			},
		});
	}

	// Si l'appareil n'est pas associé à une autre ligne et que l'agent et l'appareil fournis ne sont pas associés

	// Si pas de propriétaire de la ligne mais un lié à l'appareil
	if (!newLineOwnerId) {
		return modals.open({
			title: 'Appareil affecté à un agent',
			size: 'xl',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil {deviceFullName} est actuellement affecté à
						l'agent {deviceCurrentOwnerFullName}, mais n'est affecté
						à aucune ligne.
					</Text>
					<Text mb='xs'>
						A qui souhaitez-vous affecter la ligne ?
					</Text>
					<Text mb='xl'>
						Si vous choisissez "Pas de propriétaire", l'appareil
						sera désaffecté de son propriétaire actuel.
					</Text>
					<Flex align='center'>
						<Button
							mt='lg'
							mx='md'
							onClick={() => {
								data.agentId = deviceCurrentOwnerId;
								updateLine({ data });
								setValidationErrors({});
								exitUpdatingMode();
								modals.closeAll();
							}}
						>
							À {deviceCurrentOwnerFullName}
						</Button>
						<Button
							mt='lg'
							mx='md'
							color='rgba(68, 145, 42, 1)'
							onClick={() => {
								updateLine({
									data,
									updateDevice: true,
								});
								setValidationErrors({});
								exitUpdatingMode();
								modals.closeAll();
							}}
						>
							Pas de propriétaire
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

	// Si pas d'agent lié à l'appareil mais un lié à la ligne
	if (!deviceCurrentOwnerId) {
		return modals.openConfirmModal({
			title: 'Appareil actuellement non affecté',
			size: 'lg',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil {deviceFullName} n'est actuellement affecté à
						aucun agent.
					</Text>
					<Text mb='xl'>
						Si vous continuez, il sera affecté automatiquement à{' '}
						{newLineOwnerFullName}.
					</Text>
				</>
			),
			labels: { confirm: 'Confirmer', cancel: 'Annuler' },
			onCancel: modals.closeAll,
			onConfirm: () => {
				updateLine({
					data,
					updateDevice: true,
					updateOldLine: true,
				});
				setValidationErrors({});
				exitUpdatingMode();
				modals.closeAll();
			},
		});
	}

	// Si propriétaire de l'appareil et propriétaire de la ligne définis
	return modals.open({
		title: 'Appareil affecté à un agent',
		size: 'xl',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {deviceFullName} est actuellement affecté à
					l'agent {deviceCurrentOwnerFullName}, mais n'est affecté à
					aucune ligne.
				</Text>
				<Text mb='xs'>A qui souhaitez-vous affecter la ligne ?</Text>
				<Flex align='center'>
					<Button
						mt='lg'
						mx='md'
						onClick={() => {
							data.agentId = deviceCurrentOwnerId;
							updateLine({
								data,
								updateDevice: true,
							});
							setValidationErrors({});
							exitUpdatingMode();
							modals.closeAll();
						}}
					>
						À {deviceCurrentOwnerFullName}
					</Button>
					<Button
						mt='lg'
						mx='md'
						color='rgba(68, 145, 42, 1)'
						onClick={() => {
							updateLine({
								data,
								updateDevice: true,
							});
							setValidationErrors({});
							exitUpdatingMode();
							modals.closeAll();
						}}
					>
						À {newLineOwnerFullName}
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
