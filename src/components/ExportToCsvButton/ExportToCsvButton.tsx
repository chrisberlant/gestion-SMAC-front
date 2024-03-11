import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

interface ExportToCsvButtonProps {
	request: () => void;
}

export default function ExportToCsvButton({ request }: ExportToCsvButtonProps) {
	return (
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
