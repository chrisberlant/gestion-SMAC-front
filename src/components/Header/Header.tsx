import cx from 'clsx';
import { useState } from 'react';
import {
	Container,
	Avatar,
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
import { Link } from 'react-router-dom';

const user = {
	name: 'Jane Spoonfighter',
	email: 'janspoon@fighter.dev',
	image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

// Liste des différents onglets avec leurs titres et liens
const tabs = {
	'Lignes actives': 'active-lines',
	'Lignes résiliées': 'terminated-lines',
	Prêts: 'lent',
	Appareils: 'devices',
	Statistiques: 'stats',
	Administration: 'admin',
};

const items = Object.entries(tabs).map(([title, path]) => (
	<Link to={`/${path}`} key={title}>
		<Tabs.Tab value={title}>{title}</Tabs.Tab>
	</Link>
));

export function Header() {
	// const theme = useMantineTheme();
	const [opened, { toggle }] = useDisclosure(false);
	const [userMenuOpened, setUserMenuOpened] = useState(false);

	const logout = () => {
		console.log('Déconnexion'); // TODO envoyer requête logout au serveur
	};

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
									<Avatar
										src={user.image}
										alt={user.name}
										radius='xl'
										size={20}
									/>
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
								onClick={logout}
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
					defaultValue='Lignes actives'
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
