import { useGetAgentsAndDevicesPerService } from '@/hooks/statsQueries';
import StatsTable from '../StatsTable/StatsTable';
import Loading from '../../Loading/Loading';
import { BarChart } from '@mantine/charts';
import { Button, Flex } from '@mantine/core';
import { useRef } from 'react';
import { IconDownload } from '@tabler/icons-react';
// @ts-ignore
import { useScreenshot } from 'use-react-screenshot';
import { AgentsAndDevicesPerServiceWithNumberValuesType } from '@/types';
import { Text } from '@mantine/core';
import useExportToImage from '@/hooks/useExportToImage';

export default function AgentsAndDevicesPerService() {
	const { data, isLoading, isError } = useGetAgentsAndDevicesPerService();
	const takeScreenshot = useExportToImage();
	const ref = useRef(null);
	const filteredData = data?.filter(
		// Formatage des données, retrait des services n'ayant aucun agent ni appareil
		(element) =>
			element.devicesAmount !== '0' || element.agentsAmount !== '0'
	);
	const formattedAgentsAndDevicesPerService =
		filteredData?.map((element) => ({
			service: element.service,
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

	return (
		<>
			{isLoading && <Loading />}

			{isError && (
				<div>
					Impossible de récupérer le nombre d'agents et d'appareils
					par service depuis le serveur
				</div>
			)}

			{data && filteredData && (
				<>
					<Text size='xl' component='h3' mb={20}>
						Nombre d'agents et d'appareils par service
					</Text>
					<Flex justify='space-evenly' gap={40} ml={20}>
						<StatsTable data={filteredData} titles={titles} />
						<Flex wrap='wrap'>
							<Flex
								wrap='wrap'
								justify='center'
								ref={ref}
								w='100%'
								py={8}
								gap={20}
							>
								{dataArray.map((item) => (
									<BarChart
										key={item[0].service}
										h={300}
										w={dataArray.length > 1 ? '45%' : '80%'}
										data={item}
										dataKey='service'
										withBarValueLabel
										tooltipAnimationDuration={200}
										withLegend
										series={[
											{
												name: 'agentsAmount',
												label: 'Agents',
												color: 'blue.6',
											},
											{
												name: 'devicesAmount',
												label: 'Appareils',
												color: 'violet.6',
											},
										]}
										tickLine='none'
									/>
								))}
							</Flex>
							<Button
								w='20%'
								mt={14}
								mb={30}
								ml='70%'
								onClick={() => takeScreenshot(ref.current)}
								leftSection={<IconDownload size={20} />}
							>
								Exporter
							</Button>
						</Flex>
					</Flex>
				</>
			)}
		</>
	);
}
