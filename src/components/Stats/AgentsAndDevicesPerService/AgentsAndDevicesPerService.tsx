import { useGetAgentsAndDevicesPerService } from '@queries/statsQueries';
import StatsTable from '../StatsTable/StatsTable';
import Loading from '../../Loading/Loading';
import { BarChart } from '@mantine/charts';
import { Button, Flex } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { IconDownload } from '@tabler/icons-react';
// @ts-ignore
import { useScreenshot } from 'use-react-screenshot';
import { AgentsAndDevicesPerServiceWithNumberValuesType } from '@/types';

export default function AgentsAndDevicesPerService() {
	const { data, isLoading, isError } = useGetAgentsAndDevicesPerService();
	const formattedAgentsAndDevicesPerService =
		data?.map((element) => ({
			...element,
			devicesAmount: Number(element.devicesAmount),
			agentsAmount: Number(element.agentsAmount),
		})) ?? [];

	// Découpage du tableau de données en plusieurs tableaux
	const splitArray = (
		arr: AgentsAndDevicesPerServiceWithNumberValuesType[],
		size: number
	): AgentsAndDevicesPerServiceWithNumberValuesType[][] =>
		arr.length > size
			? [arr.slice(0, size), ...splitArray(arr.slice(size), size)]
			: [arr];
	const dataArray = splitArray(formattedAgentsAndDevicesPerService, 5);

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
					<Flex direction='column' w='40%'>
						<Flex
							direction='column'
							ref={ref}
							align='flex-end'
							py={8}
							gap={20}
						>
							{dataArray.map((item) => (
								<BarChart
									key={item[0].service}
									h={300}
									data={item}
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
							))}
						</Flex>
						<Button
							w='30%'
							mt={14}
							mb={30}
							ml='60%'
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
