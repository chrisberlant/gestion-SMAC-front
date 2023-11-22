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
	useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconSettings, IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from './header.module.css';
import { Link, useLocation } from 'react-router-dom';
import fetchApi from '../../utils/fetchApi';

const user = {
	name: 'Jane Spoonfighter',
	email: 'janspoon@fighter.dev',
};

// Liste des différents onglets avec leurs titres et liens
const tabs = {
	'Lignes actives': '/active-lines',
	'Lignes résiliées': '/terminated-lines',
	Prêts: '/lent',
	Appareils: '/devices',
	Statistiques: '/stats',
	Administration: '/admin-dashboard',
};

const items = Object.entries(tabs).map(([title, path]) => (
	<Link to={path} key={title}>
		<Tabs.Tab value={title}>{title}</Tabs.Tab>
	</Link>
));

export function Header() {
	// const theme = useMantineTheme();
	const location = useLocation();
	const activeTab = Object.entries(tabs).find(
		([, path]) => path === location.pathname
	)?.[0];
	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);

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
										{user.name}
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
					defaultValue={activeTab}
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

export default Header;
