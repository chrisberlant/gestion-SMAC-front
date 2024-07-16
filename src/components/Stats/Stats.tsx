import { Flex } from '@mantine/core';
import { IconDeviceMobile, IconUsers } from '@tabler/icons-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Stats() {
	const { pathname } = useLocation();

	return (
		<section>
			<h2>Statistiques</h2>
			<Flex component='nav' gap={40} justify='center' mb={30}>
				<NavLink to='/stats/devices-amount-per-model'>
					{({ isActive }) => (
						<div
							className='navLink'
							data-active={
								isActive ||
								pathname === '/stats' ||
								pathname === '/stats/' ||
								undefined
							}
						>
							<Flex pr={10}>
								<IconDeviceMobile />
							</Flex>
							Nombre d'appareils par modèle
						</div>
					)}
				</NavLink>
				<NavLink to='/stats/agents-and-devices-per-service'>
					{({ isActive }) => (
						<div
							className='navLink'
							data-active={isActive || undefined}
						>
							<Flex gap={2} pr={10}>
								<IconUsers />
								<IconDeviceMobile />
							</Flex>
							Nombre d'agents et d'appareils par service
						</div>
					)}
				</NavLink>
			</Flex>
			<Outlet />
		</section>
	);
}
