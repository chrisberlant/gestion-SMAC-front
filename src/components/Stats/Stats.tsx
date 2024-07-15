import { Button, Flex } from '@mantine/core';
import { IconDeviceMobile, IconUsers } from '@tabler/icons-react';
import { Link, Outlet } from 'react-router-dom';

export default function Stats() {
	return (
		<section>
			<h2>Statistiques</h2>
			<Flex gap={40} justify='center' mb={30}>
				<Link to='/stats/devices-amount-per-model'>
					<Button
						variant='subtle'
						component='span'
						leftSection={<IconDeviceMobile />}
					>
						Nombre d'appareils par modèle
					</Button>
				</Link>
				<Link to='/stats/agents-and-devices-per-service'>
					<Button
						variant='subtle'
						component='span'
						leftSection={
							<>
								<IconUsers />
								<IconDeviceMobile />
							</>
						}
					>
						Nombre d'agents et appareils par service
					</Button>
				</Link>
			</Flex>
			<Outlet />
		</section>
	);
}
