import { Menu, Tabs } from '@mantine/core';
import {
	IconUser,
	IconUsersGroup,
	IconDevicesPlus,
	IconHistory,
	IconSettings,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

export default function AdminMenu() {
	return (
		<NavLink to='/admin-dashboard'>
			{({ isActive }) => (
				<Tabs.Tab
					value='Administration'
					leftSection={<IconSettings size={20} />}
					data-active={isActive || undefined}
				>
					<Menu
						trigger='hover'
						shadow='md'
						transitionProps={{ transition: 'pop-top-left' }}
						withArrow
						width={180}
						position='right-start'
						offset={20}
					>
						<Menu.Target>
							<span>Administration</span>
						</Menu.Target>

						<Menu.Dropdown>
							<NavLink to='admin-dashboard/users'>
								<Menu.Item leftSection={<IconUser size={20} />}>
									Utilisateurs
								</Menu.Item>
							</NavLink>
							<NavLink to='admin-dashboard/services'>
								<Menu.Item
									leftSection={<IconUsersGroup size={20} />}
								>
									Services
								</Menu.Item>
							</NavLink>
							<NavLink to='admin-dashboard/models'>
								<Menu.Item
									leftSection={<IconDevicesPlus size={20} />}
								>
									Modèles
								</Menu.Item>
							</NavLink>
							<NavLink to='admin-dashboard/history'>
								<Menu.Item
									leftSection={<IconHistory size={20} />}
								>
									Historique
								</Menu.Item>
							</NavLink>
						</Menu.Dropdown>
					</Menu>
				</Tabs.Tab>
			)}
		</NavLink>
	);
}
