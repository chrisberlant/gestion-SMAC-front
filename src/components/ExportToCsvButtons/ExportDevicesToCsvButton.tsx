import { Button } from '@mantine/core';
import { CSVLink } from 'react-csv';
import { DeviceType } from '../../types/device';

type formattedAgentsType = {
	infos: string;
	vip: boolean;
	id: number;
}[];

type formattedModelsType = {
	infos: string;
	id: number;
}[];

interface ExportDevicesToCsvButtonProps {
	data: DeviceType[];
	formattedAgents: formattedAgentsType;
	formattedModels: formattedModelsType;
}

export default function ExportDevicesToCsvButton({
	data,
	formattedModels,
	formattedAgents,
}: ExportDevicesToCsvButtonProps) {
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

	const exportedData = data.map((device) => {
		return {
			...device,
			imei: `"${device.imei}`,
			isNew: device.isNew ? 'Neuf' : 'Occasion',
			agentId: formattedAgents.find(
				(agent) => agent.id === device.agentId
			)?.infos,
			modelId: formattedModels.find(
				(model) => model.id === device.modelId
			)?.infos,
		};
	});

	return (
		<CSVLink
			data={exportedData}
			headers={headers}
			filename={`Export_appareils_${Date.now()}`}
			separator={';'}
		>
			<Button color='green' my='md'>
				Exporter vers Excel
			</Button>
		</CSVLink>
	);
}
