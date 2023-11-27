import cx from 'clsx';
import { useState } from 'react';
import {
	Container,
	UnstyledButton,
	Group,
	Text,
	Menu,
	Tabs,
	Burger,
	rem,
	Loader,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconSettings, IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from './header.module.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import fetchApi from '../../utils/fetchApi';
import { useGetCurrentUser } from '../../utils/userQueries';
import { toast } from 'sonner';

// Liste des différents onglets avec leurs titres et liens
const tabs = {
	'Lignes actives': '/active-lines',
	'Lignes résiliées': '/terminated-lines',
	Prêts: '/lent',
	Appareils: '/devices',
	Statistiques: '/stats',
} as Record<string, string>;

export function Header() {
	// const theme = useMantineTheme();
	const { data: currentUser, isLoading, isError } = useGetCurrentUser();
	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);
	const navigate = useNavigate();

	if (isLoading)
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);

	if (isError) {
		window.location.href = '/login';
	}

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
				<Container className={classes.mainSection} size='md'>
					<Group justify='space-between'>
						<MantineLogo size={28} />
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom='xs'
							size='sm'
						/>

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
									<Group gap={7}>
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
								<Link to='/account-settings'>
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
									>
										Paramètres du compte
									</Menu.Item>
								</Link>
								<Menu.Item
									onClick={async () => {
										await fetchApi('/logout');
										toast.success('Déconnexion réussie');
										navigate('/login');
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
					</Group>
				</Container>

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
			</header>
		);
	}
}

export default Header;
