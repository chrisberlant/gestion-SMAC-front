import { Button } from '@mantine/core';
import { CSVLink } from 'react-csv';
import { ReactNode } from 'react';
import { IconDownload } from '@tabler/icons-react';
import { Data } from 'react-csv/lib/core';

export default function ExportDevicesToCsvButton({
	data,
	children,
}: {
	data: Data;
	children: ReactNode;
}) {
	const headers = [
		{ label: 'IMEI', key: 'imei' },
		{ label: 'Date de préparation', key: 'preparationDate' },
		{ label: "Date d'attribution", key: 'attributionDate' },
		{ label: 'Statut', key: 'status' },
		{ label: 'État', key: 'isNew' },
		{ label: 'Commentaires', key: 'comments' },
		{ label: 'Propriétaire', key: 'agentId' },
		{ label: 'Modèle', key: 'modelId' },
	];

	return (
		<CSVLink
			data={data}
			headers={headers}
			filename={`Export_appareils_${Date.now()}`}
			separator={';'}
		>
			<Button color='green' mt='lg' mr='xl' px='sm'>
				<IconDownload />
				{children}
			</Button>
		</CSVLink>
	);
}
