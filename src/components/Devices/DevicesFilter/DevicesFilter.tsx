import { Flex, Button } from '@mantine/core';
import {
	IconLineDashed,
	IconDeviceMobileRotated,
	IconDeviceMobileCheck,
	IconDeviceMobileDown,
	IconDeviceMobileQuestion,
	IconDeviceMobileShare,
	IconDeviceMobileOff,
	IconDeviceMobileCancel,
} from '@tabler/icons-react';
import { SetURLSearchParams } from 'react-router-dom';

type DevicesFilterParamsProps = {
	filterParams: URLSearchParams;
	setFilterParams: SetURLSearchParams;
};

export default function DevicesFilter({
	filterParams,
	setFilterParams,
}: DevicesFilterParamsProps) {
	return (
		<Flex mr='auto' ml='xl'>
			<Button
				mr='xl'
				radius='lg'
				color='blue'
				variant='light'
				onClick={() => {
					filterParams.delete('filter');
					setFilterParams(filterParams);
				}}
				aria-label='Afficher tous les appareils'
				leftSection={<IconLineDashed size={20} />}
			>
				Tous les appareils
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='green'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'in-stock');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils en stock'
				leftSection={<IconDeviceMobileRotated size={20} />}
			>
				Stock
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='green'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'attributed');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils attribués'
				leftSection={<IconDeviceMobileCheck size={20} />}
			>
				Attribués
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='green'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'restituted');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils restitués'
				leftSection={<IconDeviceMobileDown size={20} />}
			>
				Restitués
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='orange'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'awaiting-restitution');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils en attente de restitution'
				leftSection={<IconDeviceMobileQuestion size={20} />}
			>
				Attente restitution
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='orange'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'lent');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils en prêt'
				leftSection={<IconDeviceMobileShare size={20} />}
			>
				Prêts
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='red'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'stolen');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils volés'
				leftSection={<IconDeviceMobileOff size={20} />}
			>
				Volés
			</Button>
			<Button
				mr='xl'
				radius='lg'
				color='red'
				variant='light'
				onClick={() =>
					setFilterParams(
						(prev) => {
							prev.set('filter', 'out-of-order');
							return prev;
						},
						{ replace: true }
					)
				}
				aria-label='Afficher les appareils en panne'
				leftSection={<IconDeviceMobileCancel size={20} />}
			>
				HS
			</Button>
		</Flex>
	);
}
