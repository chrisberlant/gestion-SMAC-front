import { Table, UnstyledButton, Group, Text, Center, rem } from '@mantine/core';
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

function Th({ title, reversed, sorted, onSort }: ThProps) {
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
						<Icon
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	);
}

export default Th;
