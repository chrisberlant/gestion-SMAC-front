import { Button } from '@mantine/core';
import { useGetCurrentUser } from '../../../utils/userQueries';

interface CreateButtonProps {
	createFunction: () => void;
	checkRole?: boolean;
}

export default function CreateButton({
	createFunction,
	checkRole = true,
}: CreateButtonProps) {
	const { data: currentUser } = useGetCurrentUser();

	return checkRole && currentUser && currentUser.role === 'Consultant' ? (
		<Button
			mr='auto'
			ml='xs'
			style={{
				cursor: 'not-allowed',
				pointerEvents: 'none',
			}}
			color='#B2B2B2'
		>
			Ajout impossible
		</Button>
	) : (
		<Button onClick={createFunction} mr='auto' ml='xs'>
			Ajouter
		</Button>
	);
}
