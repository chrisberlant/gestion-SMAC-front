import { Button } from '@mantine/core';
import { useGetCurrentUser } from '@queries/userQueries';

interface CreateButtonProps {
	createFunction: () => void;
}

export default function CreateButton({ createFunction }: CreateButtonProps) {
	const { data: currentUser } = useGetCurrentUser();

	if (currentUser)
		return currentUser.role === 'Consultant' ? (
			<Button
				mr='auto'
				ml='xs'
				style={{
					cursor: 'not-allowed',
				}}
				color='#B2B2B2'
			>
				Ajouter
			</Button>
		) : (
			<Button onClick={createFunction} mr='auto' ml='xs'>
				Ajouter
			</Button>
		);
}
