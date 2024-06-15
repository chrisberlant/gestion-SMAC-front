import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { LineType, LineUpdateType } from '@customTypes/line';

interface DisplayLineUpdateModalProps {
	updateLine: (data: LineUpdateType) => void;
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
	currentDeviceOwnerId: number | null;
	currentDeviceOwnerFullName: string | null;
	newDeviceId: number | null;
	updateData: LineUpdateType;
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
	currentDeviceOwnerId,
	currentDeviceOwnerFullName,
	updateData,
}: DisplayLineUpdateModalProps) {
	// Configuration des modales
	const modalOptions = {
		size: 'lg',
		centered: true,
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
		onCancel: modals.closeAll,
		onConfirm: () => {
			updateLine(updateData);
			setValidationErrors({});
			exitUpdatingMode();
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

	// Si l'appareil n'a pas été modifié
	if (newDeviceId === currentDeviceId) {
		// Si un nouveau propriétaire mais pas d'ancien
		if (newLineOwnerId && !currentLineOwnerId)
			return openConfirmModal(
				"Affectation d'un propriétaire à l'appareil",
				<>
					<Text mb='xs'>
						L'appareil{' '}
						<span className='bold-text'>{deviceFullName}</span>{' '}
						n'appartient actuellement à aucun agent.
					</Text>
					<Text mb='xl'>
						Si vous continuez, il sera affecté à l'agent{' '}
						<span className='bold-text'>
							{newLineOwnerFullName}
						</span>
						.
					</Text>
				</>
			);

		// Retrait du propriétaire existant de la ligne
		if (!newLineOwnerId && currentLineOwnerId)
			return openConfirmModal(
				"Désaffectation du propriétaire de l'appareil",
				<>
					<Text mb='xs'>
						L'appareil{' '}
						<span className='bold-text'>{deviceFullName}</span>{' '}
						appartient actuellement à l'agent{' '}
						<span className='bold-text'>
							{currentDeviceOwnerFullName}
						</span>
						.
					</Text>
					<Text mb='xl'>
						Si vous continuez, celui-ci sera désaffecté.
					</Text>
				</>
			);

		// Si l'ancien et le nouveau propriétaire sont différents (non nuls)
		return openConfirmModal(
			"Changement de propriétaire de l'appareil",
			<>
				<Text mb='xs'>
					L'appareil{' '}
					<span className='bold-text'>{deviceFullName}</span>{' '}
					appartient actuellement à l'agent{' '}
					<span className='bold-text'>
						{currentDeviceOwnerFullName}
					</span>
					.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté à l'agent{' '}
					<span className='bold-text'>{newLineOwnerFullName}</span>.
				</Text>
			</>
		);
	}

	// Si l'appareil a été modifié

	// Si l'autre ligne a le même propriétaire que la ligne actuelle (peuvent être nuls)
	if (
		alreadyUsingDeviceLine &&
		alreadyUsingDeviceLine.agentId === newLineOwnerId
	)
		return openConfirmModal(
			"Appareil déjà associé à une autre ligne de l'agent",
			<>
				<Text mb='xs'>
					L'appareil{' '}
					<span className='bold-text'>{deviceFullName}</span> est
					actuellement affecté à la ligne{' '}
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
					Si vous continuez, il sera désaffecté de celle-ci pour être
					affecté à la ligne en cours de modification.
				</Text>
			</>
		);

	// Si l'autre ligne possède un propriétaire différent (ou aucun)
	if (
		alreadyUsingDeviceLine &&
		alreadyUsingDeviceLine.agentId !== newLineOwnerId
	)
		return openConfirmModal(
			alreadyUsingDeviceLine.agentId
				? "Appareil déjà associé à une ligne d'un autre agent"
				: 'Appareil déjà associé à une ligne sans propriétaire',
			<>
				<Text mb='xs'>
					L'appareil{' '}
					<span className='bold-text'>{deviceFullName}</span> est
					actuellement affecté à la ligne{' '}
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
					Si vous continuez, il sera désaffecté de ceux-ci pour être
					affecté à la ligne en cours de modification{' '}
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
		);

	// Si l'appareil n'est pas associé à une autre ligne et que l'agent et l'appareil fournis ne sont pas associés

	// Si pas de nouveau propriétaire de la ligne mais un lié à l'appareil
	if (!newLineOwnerId && currentDeviceOwnerId) {
		return modals.open({
			title: 'Appareil affecté à un agent',
			size: 'lg',
			centered: true,
			children: (
				<>
					<Text mb='xs'>
						L'appareil{' '}
						<span className='bold-text'>{deviceFullName}</span> est
						actuellement affecté à l'agent{' '}
						<span className='bold-text'>
							{currentDeviceOwnerFullName}
						</span>
						, mais n'est affecté à aucune ligne.
					</Text>
					<Text mb='xs'>
						A qui souhaitez-vous affecter la ligne ?
					</Text>
					<Text mb='md'>
						Si vous choisissez "Aucun propriétaire", l'appareil sera
						désaffecté de son propriétaire actuel.
					</Text>
					<Flex align='center' justify='center'>
						<Button
							mt='lg'
							mx='md'
							onClick={() => {
								updateData.agentId = currentDeviceOwnerId;
								updateLine(updateData);
								setValidationErrors({});
								exitUpdatingMode();
								modals.closeAll();
							}}
						>
							Au propriétaire de l'appareil :{' '}
							{currentDeviceOwnerFullName}
						</Button>
						<Button
							mt='lg'
							mx='md'
							color='red'
							onClick={() => {
								updateLine(updateData);
								setValidationErrors({});
								exitUpdatingMode();
								modals.closeAll();
							}}
						>
							Aucun propriétaire
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
	if (newLineOwnerId && !currentDeviceOwnerId) {
		return openConfirmModal(
			'Appareil actuellement non affecté',
			<>
				<Text mb='xs'>
					L'appareil{' '}
					<span className='bold-text'>{deviceFullName}</span> n'est
					actuellement affecté à aucun agent.
				</Text>
				<Text mb='xl'>
					Si vous continuez, il sera affecté automatiquement à{' '}
					{newLineOwnerFullName}.
				</Text>
			</>
		);
	}

	// Si propriétaire de l'appareil et propriétaire de la ligne définis et différents
	return openConfirmModal(
		"Changement du propriétaire de l'appareil",
		<>
			<Text mb='xs'>
				L'appareil <span className='bold-text'>{deviceFullName}</span>{' '}
				est actuellement affecté à l'agent{' '}
				<span className='bold-text'>{currentDeviceOwnerFullName}</span>,
				mais n'est affecté à aucune ligne.
			</Text>
			<Text mb='xl'>
				Si vous continuez, il sera affecté à l'agent{' '}
				<span className='bold-text'>{newLineOwnerFullName}</span>.
			</Text>
		</>
	);
}
