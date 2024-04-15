import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';

interface DisplayDeviceDeleteModalProps {
	deviceId: number;
	imei: string;
	affectedLineNumber: string | null;
	deleteDevice: (deviceId: number) => void;
}

export default function displayDeviceDeleteModal({
	deviceId,
	imei,
	affectedLineNumber,
	deleteDevice,
}: DisplayDeviceDeleteModalProps) {
	return modals.openConfirmModal({
		title: "Suppression d'un appareil",
		size: 'lg',
		children: (
			<>
				<Text mb={affectedLineNumber ? 'xs' : 'xl'}>
					Voulez-vous vraiment supprimer l'appareil IMEI
					<span className='bold-text'> {imei}</span> ?
				</Text>
				{affectedLineNumber && (
					<Text mb='xl'>
						Celui-ci sera également supprimé de la ligne{' '}
						<span className='bold-text'>{affectedLineNumber}</span>{' '}
						à laquelle il est affecté. Le propriétaire de la ligne
						restera inchangé.
					</Text>
				)}
			</>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteDevice(deviceId),
	});
}
