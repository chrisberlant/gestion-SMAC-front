import { Flex, Button } from '@mantine/core';
import {
	IconLineDashed,
	IconAntennaBars5,
	IconProgress,
	IconAntennaBarsOff,
} from '@tabler/icons-react';
import { SetURLSearchParams } from 'react-router-dom';

type LinesFilterParamsProps = {
	filterParams: URLSearchParams;
	setFilterParams: SetURLSearchParams;
};

export default function LinesFilter({
	filterParams,
	setFilterParams,
}: LinesFilterParamsProps) {
	return (
		<Flex mr='auto' ml='xl' align='center'>
			<Button
				mr='xl'
				radius='lg'
				color='blue'
				variant='light'
				onClick={() => {
					filterParams.delete('filter');
					setFilterParams(filterParams);
				}}
				aria-label='Afficher toutes les lignes'
				leftSection={<IconLineDashed size={20} />}
			>
				Toutes les lignes
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='green'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'active');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les lignes actives'
				leftSection={<IconAntennaBars5 size={20} />}
			>
				Actives
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='orange'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'in-progress');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les lignes en cours de création'
				leftSection={<IconProgress size={20} />}
			>
				En cours
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='red'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'resiliated');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les lignes résiliées'
				leftSection={<IconAntennaBarsOff size={20} />}
			>
				Résiliées
			</Button>
		</Flex>
	);
}
