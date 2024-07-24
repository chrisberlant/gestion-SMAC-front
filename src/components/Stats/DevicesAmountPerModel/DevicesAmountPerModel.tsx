import { useGetDevicesAmountPerModel } from '@/hooks/statsQueries';
import StatsTable from '../StatsTable/StatsTable';
import Loading from '@/components/Loading/Loading';
import { useRef } from 'react';
import { Flex, Button, List, Text } from '@mantine/core';
import { IconCircleFilled, IconDownload } from '@tabler/icons-react';
import { DonutChart } from '@mantine/charts';
import { exportToImage } from '@/utils';

export default function DevicesAmountPerModel() {
	const { data, isLoading, isError } = useGetDevicesAmountPerModel();
	const ref = useRef<HTMLDivElement>(null);
	const takeScreenshot = () =>
		exportToImage('Appareils_par_modèle_export', ref);
	const formattedDevicesAmountPerModel = data?.map((model) => ({
		name: `${model.brand} ${model.reference}${
			model.storage ? ` ${model.storage}` : ''
		}`,
		value: Number(model.devicesAmount),
		color: '#' + Math.floor(Math.random() * 16777215).toString(16),
	}));

	const titles = ['Marque', 'Modèle', 'Stockage', "Nombre d'appareils"];

	return (
		<>
			{isLoading && <Loading />}

			{isError && (
				<div>
					Impossible de récupérer le nombre d'appareils par modèle
					depuis le serveur
				</div>
			)}

			{data && formattedDevicesAmountPerModel && (
				<>
					<Text size='xl' component='h3' mb={20}>
						Nombre d'appareils par modèle
					</Text>
					<Flex justify='space-around' mb={10}>
						<StatsTable data={data} titles={titles} />
						<Flex direction='column' align='center' w='40%'>
							<Flex ref={ref} pr={8} pt={8}>
								<DonutChart
									size={200}
									thickness={24}
									paddingAngle={10}
									tooltipDataSource='segment'
									withLabels
									withLabelsLine
									data={formattedDevicesAmountPerModel}
								/>
								<List center size='sm' spacing='xs'>
									{formattedDevicesAmountPerModel.map(
										(item) =>
											item.value ? (
												<List.Item
													key={item.name}
													icon={
														<IconCircleFilled
															fill={item.color}
															size={15}
														/>
													}
												>
													{item.name}
												</List.Item>
											) : null
									)}
								</List>
							</Flex>
							<Button
								ml='auto'
								w='30%'
								onClick={takeScreenshot}
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
