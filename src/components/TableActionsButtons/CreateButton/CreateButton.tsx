import { Button } from '@mantine/core';
import { useGetCurrentUser } from '../../../queries/userQueries';

interface CreateButtonProps {
	createFunction: () => void;
	checkRole?: boolean;
}

export default function CreateButton({
	createFunction,
	checkRole = true,
}: CreateButtonProps) {
	const { data: currentUser } = useGetCurrentUser();

	if (currentUser)
		return checkRole && currentUser.role === 'Consultant' ? (
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
