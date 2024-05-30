import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/authQueries';
import displayHistoryDeleteModal from '@modals/historyDeleteModal';
import { useDeleteHistory } from '@queries/historyQueries';

interface DeleteHistoryButtonProps {
	entriesToDelete: number[];
	enabledButton: boolean;
}

export default function DeleteHistoryButton({
	entriesToDelete,
	enabledButton,
}: DeleteHistoryButtonProps) {
	const { data: currentUser } = useGetCurrentUser();
	const { mutate: deleteHistory } = useDeleteHistory();

	if (currentUser)
		return currentUser.role !== 'Admin' ? (
			<Button disabled mr='auto' ml='xs'>
				Effacer les entrées
			</Button>
		) : (
			<Button
				disabled={!enabledButton}
				onClick={() =>
					displayHistoryDeleteModal(entriesToDelete, deleteHistory)
				}
				mr='auto'
				ml='xs'
				color='red'
			>
				Effacer les entrées
			</Button>
		);
}
