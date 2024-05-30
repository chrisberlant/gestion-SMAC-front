import {
	Container,
	Flex,
	Group,
	Menu,
	Tabs,
	Text,
	UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconChevronDown,
	IconDeviceMobile,
	IconHistory,
	IconLogout,
	IconMobiledata,
	IconReportAnalytics,
	IconSettings,
	IconUser,
	IconUserCircle,
} from '@tabler/icons-react';
import cx from 'clsx';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import FrenchFlag from '@assets/french-flag.svg';
import { useGetCurrentUser } from '@queries/authQueries';
import AccountSettings from '../AccountSettings/AccountSettings';
import ThemeToggler from '../ThemeToggler/ThemeToggler';
import classes from './header.module.css';
import { toast } from 'sonner';

// Liste des différents onglets avec leurs en-têtes, liens et icônes
const baseTabs = [
	{
		header: 'Lignes',
		path: '/lines',
		icon: <IconMobiledata size={20} />,
	},
	{
		header: 'Appareils',
		path: '/devices',
		icon: <IconDeviceMobile size={20} />,
	},
	{ header: 'Agents', path: '/agents', icon: <IconUser size={20} /> },
	{
		header: 'Statistiques',
		path: '/stats',
		icon: <IconReportAnalytics size={20} />,
	},
];

// Onglets accessibles uniquement par les admins
const adminTabs = [
	{
		header: 'Historique',
		path: 'history',
		icon: <IconHistory size={20} />,
	},
	{
		header: 'Administration',
		path: 'admin-dashboard',
		icon: <IconSettings size={20} />,
	},
];

export default function Header() {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedAccountModal,
		{ open: openAccountModal, close: closeAccountModal },
	] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);

	if (currentUser) {
		const tabsToDisplay =
			currentUser.role === 'Admin'
				? [...baseTabs, ...adminTabs]
				: baseTabs;

		// Création des onglets et détection de celui actif
		const tabsItems = tabsToDisplay.map((tab) => (
			<NavLink to={tab.path} key={tab.path}>
				{({ isActive }) => (
					<Tabs.Tab
						value={tab.header}
						leftSection={tab.icon}
						{...(isActive ? { 'data-active': 'true' } : {})}
					>
						{tab.header}
					</Tabs.Tab>
				)}
			</NavLink>
		));

		return (
			<header className={classes.header}>
				<Container className={classes.mainSection} size='xl'>
					<Group>
						<div className={classes.logo}>
							<img src={FrenchFlag} />
							<span className={classes.logoTitle}>
								Gestion SMAC
							</span>
						</div>
						{/* Menu utilisateur */}
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
										<IconUserCircle size={20} />
										<Text fw={500} size='sm' lh={1} mr={3}>
											{`${currentUser.firstName} ${currentUser.lastName}`}
										</Text>
										<IconChevronDown
											size={12}
											stroke={1.5}
										/>
									</Group>
								</UnstyledButton>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									leftSection={
										<IconSettings size={16} stroke={1.5} />
									}
									onClick={openAccountModal}
								>
									Paramètres du compte
								</Menu.Item>
								<Menu.Item
									onClick={() => {
										localStorage.removeItem('smac_token');
										toast.warning(
											'Vous avez été déconnecté, vous allez être redirigé vers la page de connexion'
										);
										setTimeout(() => {
											window.location.href = '/';
										}, 2000);
									}}
									leftSection={
										<IconLogout size={16} stroke={1.5} />
									}
								>
									Déconnexion
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
						<ThemeToggler />
					</Group>
				</Container>
				{/* Onglets de navigation */}
				<nav>
					<Flex justify='center'>
						<Tabs
							radius='sm'
							variant='outline'
							visibleFrom='sm'
							classNames={{
								root: classes.tabs,
								list: classes.tabsList,
								tab: classes.tab,
							}}
						>
							<Tabs.List>{tabsItems}</Tabs.List>
						</Tabs>
					</Flex>
				</nav>
				{/* Modale de paramètres utilisateur */}
				<AccountSettings
					openedAccountModal={openedAccountModal}
					openAccountModal={openAccountModal}
					closeAccountModal={closeAccountModal}
				/>
			</header>
		);
	}
}
