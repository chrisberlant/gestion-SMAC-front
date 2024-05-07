import { Table, UnstyledButton, Group, Text, Center } from '@mantine/core';
import {
	IconSelector,
	IconChevronDown,
	IconChevronUp,
} from '@tabler/icons-react';
import classes from './tableHeader.module.css';

interface ThProps {
	title: string;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
}

// En-têtes des tableaux de statistiques, permettant de trier les éléments
export default function Th({ title, reversed, sorted, onSort }: ThProps) {
	const Icon = sorted
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
	return (
		<Table.Th className={classes.th}>
			<UnstyledButton onClick={onSort} className={classes.control}>
				<Group justify='center'>
					<Text fw={500} fz='sm'>
						{title}
					</Text>
					<Center className={classes.icon}>
						<Icon size={16} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	);
}
