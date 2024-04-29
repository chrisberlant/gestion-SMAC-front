import {
	Container,
	Flex,
	Group,
	Menu,
	Tabs,
	Text,
	UnstyledButton,
	rem,
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
import { useGetCurrentUser } from '@queries/userQueries';
import AccountSettings from '../AccountSettings/AccountSettings';
import ThemeToggler from '../ThemeToggler/ThemeToggler';
import classes from './header.module.css';
import { toast } from 'sonner';

// Liste des différents onglets avec leurs titres, liens et icônes
interface TabsType {
	[key: string]: {
		path: string;
		icon: JSX.Element;
	};
}
const tabs: TabsType = {
	Lignes: {
		path: '/lines',
		icon: <IconMobiledata size={20} />,
	},
	Appareils: { path: '/devices', icon: <IconDeviceMobile size={20} /> },
	Agents: { path: '/agents', icon: <IconUser size={20} /> },
	Statistiques: {
		path: '/stats',
		icon: <IconReportAnalytics size={20} />,
	},
};

export default function Header() {
	const { data: currentUser } = useGetCurrentUser();
	const [
		openedAccountModal,
		{ open: openAccountModal, close: closeAccountModal },
	] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);

	if (currentUser) {
		if (currentUser.role === 'Admin') {
			// Onglets accessibles uniquement par les admins
			tabs.Historique = {
				path: 'history',
				icon: <IconHistory size={20} />,
			};
			tabs.Administration = {
				path: 'admin-dashboard',
				icon: <IconSettings size={20} />,
			};
		}

		// Création des onglets et détection de celui actif
		const tabsItems = Object.entries(tabs).map(([title, values]) => (
			<NavLink to={values.path} key={title}>
				{({ isActive }) => (
					<Tabs.Tab
						value={title}
						leftSection={values.icon}
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
