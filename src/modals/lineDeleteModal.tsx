import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';

interface DisplayLineDeleteModalProps {
	id: number;
	lineNumber: string;
	currentOwnerFullName: string | null;
	deleteLine: ({ id }: { id: number }) => void;
}

export default function displayLineDeleteModal({
	id,
	lineNumber,
	currentOwnerFullName,
	deleteLine,
}: DisplayLineDeleteModalProps) {
	return modals.openConfirmModal({
		title: "Suppression d'une ligne",
		children: (
			<>
				<Text mb='xs'>
					Voulez-vous vraiment supprimer la ligne{' '}
					<span className='bold-text'>{lineNumber}</span> ?
				</Text>
				<Text mb='xl'>
					L'appareil ne sera pas supprimé
					{currentOwnerFullName ? (
						<>
							{' '}
							et sera toujours associé à son propriétaire{' '}
							<span className='bold-text'>
								{currentOwnerFullName}
							</span>
						</>
					) : (
						''
					)}
					.
				</Text>
			</>
		),
		centered: true,
		overlayProps: {
			blur: 3,
		},
		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
		confirmProps: { color: 'red' },
		onConfirm: () => deleteLine({ id }),
	});
}
