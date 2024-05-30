import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/authQueries';

interface CreateButtonProps {
	createFunction: () => void;
}

export default function CreateButton({ createFunction }: CreateButtonProps) {
	const { data: currentUser } = useGetCurrentUser();

	return currentUser?.role === 'Consultant' ? (
		<Button mr='auto' ml='xs' disabled>
			Ajouter
		</Button>
	) : (
		<Button onClick={createFunction} mr='auto' ml='xs'>
			Ajouter
		</Button>
	);
}
