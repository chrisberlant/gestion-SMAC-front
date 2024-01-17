import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { UserType } from '../../../types';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
	userUpdateSchema,
	userCreationSchema,
} from '../../../validationSchemas/userSchemas';
import {
	Flex,
	Tooltip,
	ActionIcon,
	Text,
	Button,
	Loader,
	Badge,
} from '@mantine/core';
import {
	useCreateUser,
	useDeleteUser,
	useGetAllUsers,
	useGetCurrentUser,
	useUpdateUser,
} from '../../../utils/userQueries';
import './UsersTable.css';

function UsersTable2() {
	const { data: currentUser } = useGetCurrentUser();
	const { data: users, isLoading, isError } = useGetAllUsers();
	const { mutate: createUser } = useCreateUser();
	const { mutate: updateUser } = useUpdateUser();
	const { mutate: deleteUser } = useDeleteUser();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const columns = useMemo<MRT_ColumnDef<UserType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				enableEditing: false,
			},
			{
				header: 'Nom',
				accessorKey: 'lastName',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.lastName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							lastName: undefined,
						}),
				},
			},
			{
				header: 'Prénom',
				accessorKey: 'firstName',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.firstName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							firstName: undefined,
						}),
				},
			},
			{
				header: 'Rôle',
				accessorKey: 'isAdmin',
				Cell: ({ row }) => (
					<Badge
						color={row.original.isAdmin ? 'red' : 'blue'}
						variant='light'
					>
						{row.original.isAdmin ? 'Admin' : 'Tech'}
					</Badge>
				),
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.reference,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							isAdmin: undefined,
						}),
				},
			},
			{
				header: 'Email',
				accessorKey: 'email',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.email,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							email: undefined,
						}),
				},
			},
		],
		[validationErrors]
	);

	//CREATE action
	const handleCreateUser: MRT_TableOptions<UserType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const validation = userCreationSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			createUser(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveUser: MRT_TableOptions<UserType>['onEditingRowSave'] =
		async ({ values, table, row }) => {
			// Récupérer l'id dans les colonnes cachées et l'ajouter aux données à valider
			values.id = row.original.id;
			// Validation du format des données via un schéma Zod
			const validation = userUpdateSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			updateUser(values);
			table.setEditingRow(null);
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<UserType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un modèle",
			children: (
				<Text>
					Voulez-vous vraiment supprimer l'utilisateur{' '}
					<span className='users-title'>
						{row.original.firstName} {row.original.lastName}
					</span>{' '}
					? Cette action est irréversible.
				</Text>
			),
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteUser({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: users || [],
		enableGlobalFilter: true,
		enableColumnFilters: false,
		enableColumnActions: false,
		createDisplayMode: 'modal',
		editDisplayMode: 'modal',
		enableEditing: true,
		enableHiding: false,
		sortDescFirst: true,
		enableSortingRemoval: false,
		enableDensityToggle: false,
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateUser,
		onEditingRowSave: handleSaveUser,
		onEditingRowCancel: () => setValidationErrors({}),
		paginationDisplayMode: 'pages',
		renderRowActions: ({ row, table }) =>
			currentUser!.email !== row.original.email &&
			row.original.id !== 1 ? (
				<Flex gap='md'>
					<Tooltip label='Modifier'>
						<ActionIcon
							onClick={() => table.setEditingRow(row)}
							size='sm'
						>
							<IconEdit />
						</ActionIcon>
					</Tooltip>
					<Tooltip label='Supprimer'>
						<ActionIcon
							color='red'
							onClick={() => openDeleteConfirmModal(row)}
							size='sm'
						>
							<IconTrash />
						</ActionIcon>
					</Tooltip>
				</Flex>
			) : (
				<Flex gap='md'>
					<Tooltip label='Non autorisé'>
						<ActionIcon
							style={{
								cursor: 'not-allowed',
								pointerEvents: 'none',
							}}
							color='grey'
							size='sm'
						>
							<IconEdit />
						</ActionIcon>
					</Tooltip>
					<Tooltip label='Non autorisé'>
						<ActionIcon
							style={{
								cursor: 'not-allowed',
								pointerEvents: 'none',
							}}
							color='grey'
							size='sm'
						>
							<IconTrash />
						</ActionIcon>
					</Tooltip>
				</Flex>
			),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				onClick={() => table.setCreatingRow(true)}
				mr='auto'
				ml='xs'
			>
				Ajouter
			</Button>
		),
		mantineTableProps: {
			striped: true,
		},
		mantineTopToolbarProps: {
			mt: 'xs',
			mr: 'xs',
		},
		mantineBottomToolbarProps: {
			mt: 'sm',
			mb: 'xs',
			mx: 'xl',
		},
		initialState: {
			density: 'xs',
			pagination: {
				pageIndex: 0, // page start
				pageSize: 5, // rows per page
			},
			columnVisibility: {
				id: false,
			},
		},
		mantinePaginationProps: {
			rowsPerPageOptions: ['5', '10', '20', '30'],
			withEdges: true,
		},
	});

	if (isLoading) {
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);
	}
	if (isError) {
		return (
			<div>
				Impossible de récupérer les utilisateurs depuis le serveur
			</div>
		);
	}

	return (
		<div className='Users-table'>
			<MantineReactTable table={table} />
		</div>
	);
}

export default UsersTable2;
