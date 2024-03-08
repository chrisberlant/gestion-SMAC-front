import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

interface ExportToCsvButtonProps {
	request: () => void;
}

export default function ExportToCsvButton({ request }: ExportToCsvButtonProps) {
	return (
		<Button color='green' mt='lg' mr='xl' px='sm' onClick={request}>
			<IconDownload />
			Exporter les données en CSV
		</Button>
	);
}
