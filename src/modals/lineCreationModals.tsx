import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineCreationType, LineType } from '@customTypes/line';

interface DisplayLineCreationModalProps {
	createLine: (data: LineCreationType) => void;
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

export default function displayLineCreationModal({
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
}: DisplayLineCreationModalProps) {
	// Configuration des modales
	const modalOptions = {
		size: 'lg',
		centered: true,
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
		onCancel: modals.closeAll,
		onConfirm: () => {
			createLine(creationData);
			setValidationErrors({});
			exitCreatingMode();
			modals.closeAll();
		},
	};

	// Fonction de simplification de la syntaxe des modales
	const openConfirmModal = (title: string, children: React.ReactNode) => {
		return modals.openConfirmModal({
			...modalOptions,
			title,
			children,
		});
	};

	// Si l'appareil est déjà affecté à une ligne
	if (alreadyUsingDeviceLine) {
		// Si un propriétaire est affecté à la ligne en création
		if (newOwnerId) {
			// Si le propriétaire reste le même
			if (newOwnerId === currentOwnerId) {
				return openConfirmModal(
					"Appareil déjà affecté à une autre ligne de l'agent",
					<>
						<Text mb='xs'>
							L'appareil{' '}
							<span className='bold-text'>{deviceFullName}</span>{' '}
							est actuellement affecté à l'autre ligne{' '}
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
							Si vous continuez, il sera désaffecté de la ligne
							actuelle, le propriétaire restera inchangé.
						</Text>
					</>
				);
			}

			// Si l'ancien et le nouveau propriétaire sont différents, l'ancien pouvant être nul
			return openConfirmModal(
				'Appareil déjà affecté à une autre ligne',
				<>
					<Text mb='xs'>
						L'appareil{' '}
						<span className='bold-text'>{deviceFullName}</span> est
						actuellement affecté à la ligne{' '}
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
							' sans propriétaire'
						)}
						.
					</Text>
					<Text mb='xl'>
						Si vous continuez, il sera désaffecté de cette ligne
						{currentOwnerFullName ? 'et de son proprétaire' : ''}.
					</Text>
				</>
			);
		}

		// Si pas de nouveau propriétaire mais un ancien
		if (currentOwnerId) {
			return openConfirmModal(
				"Affectation automatique d'un proprétaire",
				<>
					<Text mb='xs'>
						L'appareil{' '}
						<span className='bold-text'>{deviceFullName}</span>{' '}
						appartient actuellement à la ligne{' '}
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
						Vous n'avez pas défini de propriétaire de la ligne. Si
						vous continuez, celle-ci lui sera automatiquement
						affectée.
					</Text>
				</>
			);
		}

		// Si pas de propriétaire actuel et pas de propriétaire fourni
		return openConfirmModal(
			'Appareil déjà affecté à une autre ligne',
			<>
				<Text mb='xs'>
					L'appareil{' '}
					<span className='bold-text'>{deviceFullName}</span> est
					actuellement affecté à la ligne{' '}
					<span className='bold-text'>
						{alreadyUsingDeviceLine.number}{' '}
					</span>
					sans propriétaire.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à la
					ligne{' '}
					<span className='bold-text'>{creationData.number}</span>,
					également sans propriétaire.
				</Text>
			</>
		);
	}

	// Si appareil non affecté à une autre ligne

	// Si pas de propriétaire fourni et qu'un est défini sur l'appareil
	if (!newOwnerId) {
		return modals.open({
			title: 'Appareil affecté à un agent',
			size: 'xl',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil{' '}
						<span className='bold-text'>{deviceFullName}</span> est
						actuellement affecté à l'agent{' '}
						<span className='bold-text'>
							{currentOwnerFullName}
						</span>
						, mais n'est affecté à aucune ligne.
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
								creationData.agentId = currentOwnerId;
								createLine(creationData);
								setValidationErrors({});
								exitCreatingMode();
								modals.closeAll();
							}}
						>
							À {currentOwnerFullName}
						</Button>
						<Button
							mt='lg'
							mx='md'
							color='rgba(68, 145, 42, 1)'
							onClick={() => {
								createLine(creationData);
								setValidationErrors({});
								exitCreatingMode();
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

	// Si un propriétaire est fourni et pas de propriétaire actuel de l'appareil
	if (!currentOwnerId) {
		return openConfirmModal(
			"Affectation automatique de l'appareil",
			<>
				<Text mb='xs'>
					L'appareil{' '}
					<span className='bold-text'>{deviceFullName}</span> n'a
					actuellement aucun propriétaire et n'est affecté à aucune
					ligne.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à l'agent{' '}
					<span className='bold-text'>{newOwnerFullName}</span>.
				</Text>
			</>
		);
	}

	// Si l'actuel et le nouveau propriétaire sont différents (non nuls)
	return openConfirmModal(
		"Changement de propriétaire de l'appareil",
		<>
			<Text mb='xs'>
				L'appareil <span className='bold-text'>{deviceFullName}</span>{' '}
				appartient actuellement à l'agent{' '}
				<span className='bold-text'>{currentOwnerFullName}</span> et
				n'est affecté à aucune ligne.
			</Text>
			<Text mb='xl'>
				Si vous continuez, il sera réaffecté à l'agent{' '}
				<span className='bold-text'>{newOwnerFullName}</span>.
			</Text>
		</>
	);
}
