import cx from 'clsx';
import { useState } from 'react';
import {
	Container,
	UnstyledButton,
	Group,
	Text,
	Menu,
	Tabs,
	rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconSettings, IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from './header.module.css';
import { NavLink } from 'react-router-dom';
import { useGetCurrentUser, useLogout } from '../../utils/userQueries';
import ThemeToggler from '../ThemeToggler/ThemeToggler';
import AccountSettings from '../AccountSettings/AccountSettings';

// Liste des différents onglets avec leurs titres et liens
const tabs = {
	'Lignes attribuées': '/attributed-lines',
	'Lignes résiliées': '/resiliated-lines',
	Prêts: '/lent',
	Appareils: '/devices',
	Statistiques: '/stats',
} as Record<string, string>;

export function Header() {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedAccountModal,
		{ open: openAccountModal, close: closeAccountModal },
	] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);
	const { refetch: logout } = useLogout();

	if (currentUser) {
		if (currentUser.isAdmin) {
			tabs.Administration = 'admin-dashboard';
		}
		const items = Object.entries(tabs).map(([title, path]) => (
			<NavLink to={path} key={title}>
				{({ isActive }) => (
					<Tabs.Tab
						value={title}
						{...(isActive ? { 'data-active': 'true' } : {})}
					>
						{title}
					</Tabs.Tab>
				)}
			</NavLink>
		));

		return (
			<header className={classes.header}>
				<Container className={classes.mainSection} size='xl'>
					<Group>
						<MantineLogo size={28} className={classes.logo} />
						<Menu
							width={260}
							position='bottom-end'
							transitionProps={{ transition: 'pop-top-right' }}
							onClose={() => setUserMenuOpened(false)}
							onOpen={() => setUserMenuOpened(true)}
							withinPortal
						>
							<Menu.Target>
								<UnstyledButton
									className={cx(classes.user, {
										[classes.userActive]: userMenuOpened,
									})}
								>
									<Group
										gap={7}
										className={classes.userProfile}
									>
										<Text fw={500} size='sm' lh={1} mr={3}>
											{currentUser.firstName +
												' ' +
												currentUser.lastName}
										</Text>
										<IconChevronDown
											style={{
												width: rem(12),
												height: rem(12),
											}}
											stroke={1.5}
										/>
									</Group>
								</UnstyledButton>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									leftSection={
										<IconSettings
											style={{
												width: rem(16),
												height: rem(16),
											}}
											stroke={1.5}
										/>
									}
									onClick={openAccountModal}
								>
									Paramètres du compte
								</Menu.Item>
								<Menu.Item
									onClick={() => logout()}
									leftSection={
										<IconLogout
											style={{
												width: rem(16),
												height: rem(16),
											}}
											stroke={1.5}
										/>
									}
								>
									Déconnexion
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
						<ThemeToggler />
					</Group>
				</Container>
				<nav>
					<Container size='md'>
						<Tabs
							variant='outline'
							visibleFrom='sm'
							classNames={{
								root: classes.tabs,
								list: classes.tabsList,
								tab: classes.tab,
							}}
						>
							<Tabs.List>{items}</Tabs.List>
						</Tabs>
					</Container>
				</nav>
				<AccountSettings
					openedAccountModal={openedAccountModal}
					closeAccountModal={closeAccountModal}
				/>
			</header>
		);
	}
}

export default Header;
