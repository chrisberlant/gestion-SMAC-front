import cx from 'clsx';
import {
	ActionIcon,
	useMantineColorScheme,
	useComputedColorScheme,
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './themeToggler.module.css';

export default function ThemeToggler() {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme('light', {
		getInitialValueInEffect: true,
	});

	return (
		<div className={classes.themeToggler}>
			<ActionIcon
				onClick={() =>
					setColorScheme(
						computedColorScheme === 'light' ? 'dark' : 'light'
					)
				}
				variant='subtle'
				size='30'
				aria-label='Changer le thème'
			>
				<IconSun
					className={cx(classes.icon, classes.dark)}
					stroke={1.5}
				/>
				<IconMoon
					className={cx(classes.icon, classes.light)}
					stroke={1.5}
				/>
			</ActionIcon>
		</div>
	);
}
