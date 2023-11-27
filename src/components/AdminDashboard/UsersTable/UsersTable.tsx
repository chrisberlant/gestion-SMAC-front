import { UserType } from '../../../@types/types';
import {
	Badge,
	Table,
	Group,
	Text,
	ActionIcon,
	Anchor,
	rem,
	Loader,
} from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useGetAllUsers, useGetCurrentUser } from '../../../utils/userQueries';
import { toast } from 'sonner';
import './usersTable.css';

function UsersTable() {
	const { data: currentUser, isError: currentUserError } =
		useGetCurrentUser();
	const { data: users, isLoading, isError, error } = useGetAllUsers();

	if (isLoading)
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);

	if (isError || currentUserError) {
		toast.error(
			'Impossible de récupérer les utilisateurs depuis le serveur'
		);
		return <div className='error'>{error!.message}</div>;
	}

	const rows = users!.map((user: UserType) => (
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
			<Table.Td width={80}>
				{currentUser!.email !== user.email && (
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
				)}
			</Table.Td>
		</Table.Tr>
	));

	return (
		<div className='users-table'>
			<h2>Gérer les utilisateurs</h2>
			<IconPlus cursor='pointer' aria-label='Ajouter un utilisateur' />
			<Table.ScrollContainer minWidth={500}>
				<Table verticalSpacing='sm' striped highlightOnHover>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Utilisateur</Table.Th>
							<Table.Th>Rôle</Table.Th>
							<Table.Th>Email</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</div>
	);
}

export default UsersTable;
