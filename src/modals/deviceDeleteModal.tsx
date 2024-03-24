import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { MRT_Row } from 'mantine-react-table';
import { DeviceType } from '@customTypes/device';

interface DisplayDeviceDeleteModalProps {
	row: MRT_Row<DeviceType>;
	deleteDevice: (id: number) => void;
}

export default function displayDeviceDeleteModal({
	row,
	deleteDevice,
}: DisplayDeviceDeleteModalProps) {
	return modals.openConfirmModal({
		title: "Suppression d'un device",
		children: (
			<Text>
				Voulez-vous vraiment supprimer l'appareil{' '}
				<span className='bold-text'>{row.original.imei}</span> ? Cette
				action est irréversible.
			</Text>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteDevice(row.original.id),
	});
}
