import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { DeviceType } from '@customTypes/device';
import { LineType } from '../types/line';

interface DisplayDeviceDeleteModalProps {
	row: MRT_Row<DeviceType>;
	lineUsingDevice: LineType | null;
	deleteDevice: (deviceId: number) => void;
}

export default function displayDeviceDeleteModal({
	row,
	lineUsingDevice,
	deleteDevice,
}: DisplayDeviceDeleteModalProps) {
	const { id: deviceId, imei } = row.original;
	return modals.openConfirmModal({
		title: "Suppression d'un appareil",
		size: 'lg',
		children: (
			<>
				<Text mb={lineUsingDevice ? 'xs' : 'xl'}>
					Voulez-vous vraiment supprimer l'appareil IMEI
					<span className='bold-text'> {imei}</span> ?
				</Text>
				{lineUsingDevice && (
					<Text mb='xl'>
						Celui-ci sera également supprimé de la ligne{' '}
						<span className='bold-text'>
							{lineUsingDevice.number}
						</span>{' '}
						à laquelle il est affecté. Le propriétaire de la ligne
						sera inchangé.
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
