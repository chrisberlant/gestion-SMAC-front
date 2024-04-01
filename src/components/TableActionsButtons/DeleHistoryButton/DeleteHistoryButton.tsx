import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/userQueries';
import displayHistoryDeleteModal from '../../../modals/historyDeleteModal';
import { useDeleteHistory } from '../../../queries/historyQueries';

interface DeleteHistoryButtonProps {
	entriesToDelete: number[];
}

export default function DeleteHistoryButton({
	entriesToDelete,
}: DeleteHistoryButtonProps) {
	const { data: currentUser } = useGetCurrentUser();
	const { mutate: deleteHistory } = useDeleteHistory();

	if (currentUser)
		return currentUser.role !== 'Admin' ? (
			<Button
				mr='auto'
				ml='xs'
				style={{
					cursor: 'not-allowed',
				}}
				color='#B2B2B2'
			>
				Effacer
			</Button>
		) : (
			<Button
				onClick={() =>
					displayHistoryDeleteModal(deleteHistory, entriesToDelete)
				}
				mr='auto'
				ml='xs'
				color='red'
			>
				Effacer les entrées
			</Button>
		);
}
