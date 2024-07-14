import { useGetAgentsAndDevicesPerService } from '@queries/statsQueries';
import StatsTable from '../StatsTable/StatsTable';
import Loading from '../../Loading/Loading';
import { BarChart } from '@mantine/charts';
import { Button, Flex } from '@mantine/core';
import { useEffect, useRef } from 'react';
// @ts-ignore
import { useScreenshot } from 'use-react-screenshot';
import { IconDownload } from '@tabler/icons-react';

export default function AgentsAndDevicesPerService() {
	const { data, isLoading, isError } = useGetAgentsAndDevicesPerService();
	const titles = ['Service', "Nombre d'agents", "Nombre d'appareils"];
	const ref = useRef(null);
	const [image, takeScreenshot] = useScreenshot();
	const downloadScreenshot = () => {
		const link = document.createElement('a');
		link.href = image;
		link.download = `agents_appareils_par_service_export_${Date.now()}.png`;
		link.click();
	};

	useEffect(() => {
		if (image) downloadScreenshot();
	}, [image]);

	return (
		<>
			{isLoading && <Loading />}

			{isError && (
				<div>
					Impossible de récupérer le nombre d'agents et d'appareils
					par service depuis le serveur
				</div>
			)}

			{data && (
				<Flex justify='space-around'>
					<StatsTable
						data={data}
						titles={titles}
						tableTitle="Nombre d'agents et appareils par service"
					/>
					<Flex direction='column' align='flex-end' w='40%' gap={20}>
						<BarChart
							ref={ref}
							h={300}
							data={data}
							dataKey='service'
							withBarValueLabel
							tooltipAnimationDuration={200}
							withLegend
							series={[
								{
									name: 'agentsAmount',
									label: 'Agents',
									color: 'violet.6',
								},
								{
									name: 'devicesAmount',
									label: 'Appareils',
									color: 'blue.6',
								},
							]}
							tickLine='none'
						/>
						<Button
							w='30%'
							onClick={() => takeScreenshot(ref.current)}
							leftSection={<IconDownload size={20} />}
						>
							Exporter
						</Button>
					</Flex>
				</Flex>
			)}
		</>
	);
}
