import {
	IconUser,
	IconHistory,
	IconSettings,
	IconUsersGroup,
	IconDevices,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { Group, Text } from '@mantine/core';
import classes from './adminNavBar.module.css';

const dashboardSections = [
	{ icon: IconUser, label: 'Utilisateurs', path: '/admin-dashboard/users' },
	{
		icon: IconUsersGroup,
		label: 'Services',
		path: '/admin-dashboard/services',
	},
	{
		icon: IconDevices,
		label: 'Modèles',
		path: '/admin-dashboard/models',
	},
	{
		icon: IconHistory,
		label: 'Historique',
		path: '/admin-dashboard/history',
	},
];

const dashboardTabs = dashboardSections.map((item) => (
	<NavLink to={item.path} key={item.label}>
		{({ isActive }) => (
			<div className='navLink' data-active={isActive || undefined}>
				<item.icon className='linkIcon' stroke={1.5} />
				<span>{item.label}</span>
			</div>
		)}
	</NavLink>
));

export default function AdminNavBar() {
	return (
		<nav className={classes.navbar}>
			<div className={classes.navbarMain}>
				<Group className={classes.header} justify='center'>
					<IconSettings size={28} />
					<Text fw={700}>Tableau de bord Admin</Text>
				</Group>
				{dashboardTabs}
			</div>
		</nav>
	);
}
