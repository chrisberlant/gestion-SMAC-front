import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { DeviceUpdateType } from '@customTypes/device';

interface DisplayDeviceOwnerChangeModalProps {
	updateDevice: (data: DeviceUpdateType) => void;
	setValidationErrors: (
		value: React.SetStateAction<Record<string, string | undefined>>
	) => void;
	closeEditing: () => void;
	data: DeviceUpdateType;
	lineUsingDevice: string;
	lineOwnerFullName: string | null;
	imei: string;
}

export default function displayDeviceOwnerChangeModal({
	updateDevice,
	setValidationErrors,
	closeEditing,
	data,
	lineUsingDevice,
	lineOwnerFullName,
	imei,
}: DisplayDeviceOwnerChangeModalProps) {
	return modals.openConfirmModal({
		title: 'Appareil actuellement affecté à une ligne',
		size: 'lg',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					L'appareil {imei} est actuellement affecté à la ligne{' '}
					<span className='bold-text'>{lineUsingDevice}</span>
					{lineOwnerFullName ? (
						<>
							{' '}
							de l'agent{' '}
							<span className='bold-text'>
								{lineOwnerFullName}
							</span>
						</>
					) : (
						<> sans propriétaire</>
					)}
					.
				</Text>
				<Text mb='xl'>
					Si vous continuez, le propriétaire de cette ligne sera
					également {data.agentId ? 'mis à jour' : 'supprimé'}.
				</Text>
			</>
		),
		labels: { confirm: 'Confirmer', cancel: 'Annuler' },
		onCancel: modals.closeAll,
		onConfirm: () => {
			updateDevice(data);
			setValidationErrors({});
			closeEditing();
			modals.closeAll();
		},
	});
}
