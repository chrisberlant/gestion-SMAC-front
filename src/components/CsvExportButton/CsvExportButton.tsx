import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useGetCurrentUser } from '@queries/authQueries';

export default function CsvExportButton({ request }: { request: () => void }) {
	const { data: currentUser } = useGetCurrentUser();

	return currentUser?.role === 'Consultant' ? (
		<Button
			disabled
			leftSection={<IconDownload size={20} />}
			mt='xs'
			mr='xl'
			px='md'
		>
			Exporter les données en CSV
		</Button>
	) : (
		<Button
			leftSection={<IconDownload size={20} />}
			color='green'
			mt='xs'
			mr='xl'
			px='md'
			onClick={request}
		>
			Exporter les données en CSV
		</Button>
	);
}
