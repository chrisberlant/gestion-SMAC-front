import { UserType } from '../../../@types/types';
import {
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	Anchor,
	rem,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import './usersTable.css';

interface UsersTableProps {
	users: UserType[];
}

function UsersTable({ users }: UsersTableProps) {
	const rows = users.map((user: UserType) => (
		<Table.Tr key={user.email}>
			<Table.Td>
				<Group gap='sm'>
					<Text fz='sm' fw={500}>
						{user.firstName + ' ' + user.lastName}
					</Text>
				</Group>
			</Table.Td>

			<Table.Td>
				<Badge color={user.isAdmin ? 'red' : 'blue'} variant='light'>
					{user.isAdmin ? 'Admin' : 'Tech'}
				</Badge>
			</Table.Td>
			<Table.Td>
				<Anchor component='button' size='sm'>
					{user.email}
				</Anchor>
			</Table.Td>
			<Table.Td>
				<Group gap={0} justify='flex-end'>
					<ActionIcon variant='subtle' color='gray'>
						<IconPencil
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</ActionIcon>
					<ActionIcon variant='subtle' color='red'>
						<IconTrash
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<div className='users-table'>
			<h2>Utilisateurs de l'application</h2>
			<Table.ScrollContainer minWidth={500}>
				<Table verticalSpacing='sm' striped highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Utilisateur</Table.Th>
							<Table.Th>Rôle</Table.Th>
							<Table.Th>Email</Table.Th>
							<Table.Th />
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</div>
	);
}

export default UsersTable;
