import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineCreationType, LineType } from '../types/line';

interface createLineProps {
	data: LineCreationType;
	updateDevice?: boolean;
	updateOldLine?: boolean;
}

interface displayLineCreationModalProps {
	createLine: ({ data, updateDevice }: createLineProps) => void;
	exitCreatingMode: () => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	alreadyUsingDeviceLine: LineType | null;
	deviceFullName: string | null;
	currentOwnerFullName: string | null;
	currentOwnerId: number | null;
	newOwnerFullName: string | null;
	newOwnerId: number | null;
	creationData: LineCreationType;
}

// L'appareil possède déjà un propriétaire différent, propose le choix entre les deux
export function displayLineCreationModal({
	createLine,
	exitCreatingMode,
	setValidationErrors,
	alreadyUsingDeviceLine,
	deviceFullName,
	currentOwnerFullName,
	currentOwnerId,
	newOwnerFullName,
	newOwnerId,
	creationData,
}: displayLineCreationModalProps) {
	// Si l'appareil est déjà affecté à une ligne
	if (alreadyUsingDeviceLine) {
		// Si un propriétaire est affecté à la ligne en création
		if (newOwnerId) {
			// Si le propriétaire reste le même
			if (newOwnerId === currentOwnerId) {
				return modals.openConfirmModal({
					title: "Appareil déjà affecté à une autre ligne appartenant à l'agent",
					size: 'lg',
					centered: true,
					children: (
						<>
							<Text mb='xs'>
								L'appareil {deviceFullName} est actuellement
								affecté à la ligne{' '}
								<span className='bold-text'>
									{alreadyUsingDeviceLine.number}
								</span>{' '}
								de l'agent{' '}
								<span className='bold-text'>
									{currentOwnerFullName}
								</span>
								.
							</Text>
							<Text mb='xl'>
								Si vous continuez, il sera désaffecté de la
								ligne{' '}
								<span className='bold-text'>
									{creationData.number}
								</span>
								, le propriétaire restera inchangé.
							</Text>
						</>
					),
					labels: { confirm: 'Confirmer', cancel: 'Annuler' },
					onCancel: modals.closeAll,
					onConfirm: () => {
						createLine({
							data: creationData,
							updateOldLine: true,
						});
						setValidationErrors({});
						exitCreatingMode();
						modals.closeAll();
					},
				});
			}

			// Si l'ancien et le nouveau propriétaire sont différents, l'ancien pouvant être nul
			return modals.open({
				title: 'Appareil déjà affecté à une autre ligne',
				size: 'xl',
				centered: true,
				children: (
					<>
						<Text mb='xs'>
							L'appareil {deviceFullName} est actuellement affecté
							à la ligne{' '}
							<span className='bold-text'>
								{alreadyUsingDeviceLine.number}
							</span>
							{currentOwnerId ? (
								<>
									{' '}
									de l'agent{' '}
									<span className='bold-text'>
										{currentOwnerFullName}
									</span>
								</>
							) : (
								<> sans propriétaire</>
							)}
							.
						</Text>
						<Text>A qui souhaitez-vous affecter la ligne ?</Text>
						<Flex align='center'>
							<Button
								mt='lg'
								mx='md'
								onClick={() => {
									creationData.agentId =
										currentOwnerId ?? null;
									createLine({
										data: creationData,
										updateOldLine: true,
									});
									setValidationErrors({});
									exitCreatingMode();
									modals.closeAll();
								}}
							>
								{currentOwnerId
									? `Au propriétaire actuel ${currentOwnerFullName}`
									: 'Créer la ligne sans propriétaire'}
							</Button>
							<Button
								mt='lg'
								mx='md'
								color='rgba(68, 145, 42, 1)'
								onClick={() => {
									createLine({
										data: creationData,
										updateDevice: true,
										updateOldLine: true,
									});
									setValidationErrors({});
									exitCreatingMode();
									modals.closeAll();
								}}
							>
								À {newOwnerFullName}
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

		// Si pas de nouveau propriétaire mais un ancien
		if (currentOwnerId) {
			return modals.openConfirmModal({
				title: "Affectation automatique de l'appareil",
				size: 'lg',
				centered: true,
				children: (
					<>
						<Text mb='xs'>
							L'appareil {deviceFullName} appartient actuellement
							à la ligne{' '}
							<span className='bold-text'>
								{alreadyUsingDeviceLine.number}
							</span>{' '}
							de l'agent{' '}
							<span className='bold-text'>
								{currentOwnerFullName}
							</span>
							.
						</Text>
						<Text mb='xl'>
							Vous n'avez pas défini de propriétaire de la ligne.
							Si vous continuez, celle-ci lui sera automatiquement
							affectée.
						</Text>
					</>
				),
				labels: { confirm: 'Confirmer', cancel: 'Annuler' },
				onCancel: modals.closeAll,
				onConfirm: () => {
					creationData.agentId = currentOwnerId;
					createLine({
						data: creationData,
						updateOldLine: true,
					});
					setValidationErrors({});
					exitCreatingMode();
					modals.closeAll();
				},
			});
		}

		// Si pas de propriétaire actuel et pas de propriétaire fourni
		return modals.openConfirmModal({
			title: 'Appareil déjà affecté à une autre ligne',
			size: 'lg',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil {deviceFullName} est actuellement affecté à
						la ligne{' '}
						<span className='bold-text'>
							{alreadyUsingDeviceLine.number}{' '}
						</span>
						sans propriétaire.
					</Text>
					<Text mb='xl'>
						Si vous continuez, il sera affecté automatiquement à la
						ligne{' '}
						<span className='bold-text'>{creationData.number}</span>
						, également sans propriétaire.
					</Text>
				</>
			),
			labels: { confirm: 'Confirmer', cancel: 'Annuler' },
			onCancel: modals.closeAll,
			onConfirm: () => {
				createLine({
					data: creationData,
					updateOldLine: true,
				});
				setValidationErrors({});
				exitCreatingMode();
				modals.closeAll();
			},
		});
	}

	// Si appareil non affecté à une autre ligne

	// Si pas de nouveau propriétaire fourni et qu'un ancien est défini
	if (!newOwnerId) {
		return modals.openConfirmModal({
			title: "Affectation automatique de l'appareil",
			size: 'lg',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil {deviceFullName} appartient actuellement à
						l'agent{' '}
						<span className='bold-text'>
							{currentOwnerFullName}
						</span>{' '}
						et n'est affecté à aucune ligne.
					</Text>
					<Text mb='xl'>
						Vous n'avez pas défini de propriétaire de la ligne. Si
						vous continuez, celle-ci lui sera automatiquement
						affectée.
					</Text>
				</>
			),
			labels: { confirm: 'Confirmer', cancel: 'Annuler' },
			onCancel: modals.closeAll,
			onConfirm: () => {
				creationData.agentId = currentOwnerId;
				createLine({
					data: creationData,
				});
				setValidationErrors({});
				exitCreatingMode();
				modals.closeAll();
			},
		});
	}

	// Si un propriétaire est affecté à la ligne en création
	// Si pas de propriétaire actuel
	if (!currentOwnerId) {
		return modals.openConfirmModal({
			title: "Affectation automatique de l'appareil",
			size: 'lg',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil {deviceFullName} n'a actuellement aucun
						propriétaire et n'est affecté à aucune ligne.
					</Text>
					<Text mb='xl'>
						Si vous continuez, il sera affecté automatiquement à
						l'agent{' '}
						<span className='bold-text'>{newOwnerFullName}</span>.
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

	// Si l'ancien et le nouveau propriétaire sont différents (non nuls)
	return modals.open({
		title: 'Appareil déjà affecté à un autre agent',
		size: 'xl',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {deviceFullName} appartient déjà à l'agent{' '}
					<span className='bold-text'>{currentOwnerFullName}</span> et
					n'est affecté à aucune ligne.
				</Text>
				<Text>
					Voulez-vous le réaffecter à{' '}
					<span className='bold-text'>{newOwnerFullName} </span>?
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
						Confirmer la réaffectation à {newOwnerFullName}
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
