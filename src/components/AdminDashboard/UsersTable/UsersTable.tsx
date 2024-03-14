import { Badge, Loader, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
	useCreateUser,
	useDeleteUser,
	useGetAllUsers,
	useResetPassword,
	useUpdateUser,
} from '@/queries/userQueries';
import {
	userCreationSchema,
	userUpdateSchema,
} from '@validationSchemas/userSchemas';
import {
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { UserType } from '../../../types/user';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import EditDeleteResetPasswordButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteResetPasswordButtons';
import {
	displayResetUserPasswordModal,
	displayResetUserPasswordSuccessModal,
} from '../../../modals/resetUserPasswordModals';

export default function UsersTable() {
	const { data: users, isLoading, isError } = useGetAllUsers();
	const { mutate: createUser } = useCreateUser();
	const { mutate: updateUser } = useUpdateUser();
	const { mutate: resetPassword } = useResetPassword(
		displayResetUserPasswordSuccessModal
	);
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
				size: 150,
				mantineEditTextInputProps: {
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
				size: 150,
				mantineEditTextInputProps: {
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
				accessorKey: 'role',
				size: 150,
				editVariant: 'select',
				mantineEditSelectProps: {
					data: ['Tech', 'Admin', 'Consultant'], // Options disponibles dans le menu déroulant
					allowDeselect: false,
					error: validationErrors?.role,
					searchable: false, // Désactiver la recherche
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							role: undefined,
						}),
				},
				Cell: ({ row }) => {
					const roleColor =
						row.original.role === 'Admin'
							? 'red'
							: row.original.role === 'Tech'
							? 'blue'
							: 'gray';
					return (
						<Badge color={roleColor} w={96} variant='light'>
							{row.original.role}
						</Badge>
					);
				},
			},
			{
				header: 'Email',
				accessorKey: 'email',
				size: 400,
				mantineEditTextInputProps: {
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

			// Si l'utilisateur existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.email.toLocaleLowerCase() ===
							values.email.toLocaleLowerCase().trim()
					)
			) {
				toast.error(
					'Un utilisateur avec cette adresse mail existe déjà'
				);
				return setValidationErrors({
					email: ' ',
				});
			}

			setValidationErrors({});
			createUser(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveUser: MRT_TableOptions<UserType>['onEditingRowSave'] =
		async ({ values, row }) => {
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

			// Si l'utilisateur existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.email.toLocaleLowerCase() ===
								values.email.toLocaleLowerCase().trim() &&
							row.original.id !== values.id
					)
			) {
				toast.error(
					'Un utilisateur avec cette adresse mail existe déjà'
				);
				return setValidationErrors({
					email: ' ',
				});
			}

			setValidationErrors({});
			updateUser(values);
			table.setEditingRow(null);
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<UserType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un utilisateur",
			children: (
				<Text>
					Voulez-vous vraiment supprimer l'utilisateur{' '}
					<span className='bold-text'>
						{row.original.firstName} {row.original.lastName}
					</span>{' '}
					? Cette action est irréversible.
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
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
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		enableHiding: false,
		sortDescFirst: true,
		enableSortingRemoval: false,
		enableDensityToggle: false,
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateUser,
		onEditingRowSave: handleSaveUser,
		onEditingRowCancel: () => setValidationErrors({}),
		mantineSearchTextInputProps: {
			placeholder: 'Rechercher',
			// style: { minWidth: '100px' },
			variant: 'default',
		},
		paginationDisplayMode: 'pages',
		mantineTableContainerProps: { style: { minWidth: '60vw' } },
		renderRowActions: ({ row }) => (
			<EditDeleteResetPasswordButtons
				rowEmail={row.original.email}
				rowId={row.original.id}
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
				resetPasswordFunction={() =>
					displayResetUserPasswordModal({ row, resetPassword })
				}
			/>
		),
		renderTopToolbarCustomActions: () => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
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

	return (
		<div className='users-table'>
			<h2>Utilisateurs et droits</h2>

			{isLoading && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{isError && (
				<span>
					Impossible de récupérer les utilisateurs depuis le serveur
				</span>
			)}

			{users && <MantineReactTable table={table} />}
		</div>
	);
}
