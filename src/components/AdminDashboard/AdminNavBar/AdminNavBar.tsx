import { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem, Tabs } from '@mantine/core';
import {
	IconHome2,
	IconGauge,
	IconDeviceDesktopAnalytics,
	IconUser,
	IconHistory,
	IconLogout,
	IconSwitchHorizontal,
	IconCalendarStats,
	IconFingerprint,
	IconSettings,
} from '@tabler/icons-react';
import classes from './adminNavBar.module.css';
import { NavLink } from 'react-router-dom';

interface NavbarLinkProps {
	icon: typeof IconHome2;
	label: string;
	path: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, path, onClick }: NavbarLinkProps) {
	return (
		<Tooltip
			label={label}
			position='right'
			transitionProps={{ duration: 0 }}
		>
			<NavLink to={path} key={path}>
				{({ isActive }) => (
					<UnstyledButton
						onClick={onClick}
						className={classes.link}
						data-active={isActive || undefined}
					>
						<Icon
							style={{ width: rem(20), height: rem(20) }}
							stroke={1.5}
						/>
					</UnstyledButton>
				)}
			</NavLink>
		</Tooltip>
	);
}

const dashboardSections = [
	{ icon: IconUser, label: 'Utilisateurs', path: '/admin-dashboard/users' },
	{ icon: IconGauge, label: 'Services', path: '/admin-dashboard/services' },
	{
		icon: IconDeviceDesktopAnalytics,
		label: 'Modèles',
		path: '/admin-dashboard/models',
	},
	{
		icon: IconHistory,
		label: 'Historique',
		path: '/admin-dashboard/history',
	},
];

export default function AdminNavBar() {
	const [active, setActive] = useState(2);

	const links = dashboardSections.map((link, index) => (
		<NavbarLink
			{...link}
			key={link.label}
			active={index === active}
			onClick={() => setActive(index)}
		/>
	));

	return (
		<nav className={classes.navbar}>
			<div className={classes.navbarMain}>
				<Stack justify='center' gap={0}>
					{links}
				</Stack>
			</div>
		</nav>
	);
}
