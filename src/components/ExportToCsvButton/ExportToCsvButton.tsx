import { Button } from '@mantine/core';
import { CSVLink } from 'react-csv';
import { IconDownload } from '@tabler/icons-react';
import { Data } from 'react-csv/lib/core';

interface ExportToCsvButtonProps {
	data: Data;
	variant: 'lines' | 'devices' | 'agents';
}

export default function ExportToCsvButton({
	data,
	variant,
}: ExportToCsvButtonProps) {
	let headers: { label: string; key: string }[] = [];
	let fileName = '';
	const dateNow = Date.now();

	if (variant === 'lines') {
		headers = [
			{ label: 'Numéro', key: 'number' },
			{ label: 'Profil', key: 'profile' },
			{ label: 'Statut', key: 'status' },
			{ label: 'Propriétaire', key: 'agentId' },
			{ label: 'Appareil', key: 'deviceId' },
			{ label: 'Commentaires', key: 'comments' },
		];
		fileName = `Export_lignes_${dateNow}`;
	} else if (variant === 'devices') {
		headers = [
			{ label: 'IMEI', key: 'imei' },
			{ label: 'Statut', key: 'status' },
			{ label: 'État', key: 'isNew' },
			{ label: 'Modèle', key: 'modelId' },
			{ label: 'Propriétaire', key: 'agentId' },
			{ label: 'Date de préparation', key: 'preparationDate' },
			{ label: "Date d'attribution", key: 'attributionDate' },
			{ label: 'Commentaires', key: 'comments' },
		];
		fileName = `Export_appareils_${dateNow}`;
	} else if (variant === 'agents') {
		headers = [
			{ label: 'Nom', key: 'lastName' },
			{ label: 'Prénom', key: 'firstName' },
			{ label: 'Email', key: 'email' },
			{ label: 'VIP', key: 'vip' },
			{ label: 'Service', key: 'serviceId' },
		];
		fileName = `Export_agents_${dateNow}`;
	}

	return (
		<CSVLink
			data={data}
			headers={headers}
			filename={fileName}
			separator={';'}
		>
			<Button color='green' mt='lg' mr='xl' px='sm'>
				<IconDownload />
				Exporter les données en CSV
			</Button>
		</CSVLink>
	);
}
