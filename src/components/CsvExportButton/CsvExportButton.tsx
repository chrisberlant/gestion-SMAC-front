import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useGetCurrentUser } from '@queries/userQueries';

export default function CsvExportButton({ request }: { request: () => void }) {
	const { data: currentUser } = useGetCurrentUser();

	if (currentUser)
		return currentUser.role === 'Consultant' ? (
			<Button
				color='#B2B2B2'
				style={{
					cursor: 'not-allowed',
				}}
				mt='lg'
				mr='xl'
				px='md'
			>
				Exporter les données en CSV
			</Button>
		) : (
			<Button
				leftSection={<IconDownload size={20} />}
				color='green'
				mt='lg'
				mr='xl'
				px='md'
				onClick={request}
			>
				Exporter les données en CSV
			</Button>
		);
}
