import { Badge, Loader } from '@mantine/core';
import {
	useCreateUser,
	useDeleteUser,
	useGetAllUsers,
	useResetPassword,
	useUpdateUser,
} from '@queries/userQueries';
import {
	userCreationSchema,
	userUpdateSchema,
} from '@validationSchemas/userSchemas';
import {
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { UserType, UserUpdateType } from '@customTypes/user';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import EditDeleteResetPasswordButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteResetPasswordButtons';
import {
	displayUserPasswordResetModal,
	displayUserPasswordResetSuccessModal,
} from '@modals/userPasswordResetModals';
import displayDeleteUserModal from '@modals/userDeleteModal';
import { getModifiedValues } from '@utils/index';

export default function UsersTable() {
	const { data: users, isLoading, isError } = useGetAllUsers();
	const { mutate: createUser } = useCreateUser();
	const { mutate: updateUser } = useUpdateUser();
	const { mutate: resetPassword } = useResetPassword(
		displayUserPasswordResetSuccessModal
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
				size: 130,
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
						<Badge color={roleColor} variant='light'>
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
							row.original.email.toLowerCase() ===
							values.email.toLowerCase().trim()
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
			const { lastName, firstName, email, role } = values;
			const { ...originalData } = row.original;

			// Formatage des données
			const newData = {
				id: originalData.id,
				lastName,
				firstName,
				email,
				role,
			} as UserType;

			// Optimisation pour envoyer uniquement les données modifiées
			const newModifiedData = getModifiedValues(
				originalData,
				newData
			) as UserUpdateType;

			// Si aucune modification des données
			if (Object.keys(newModifiedData).length < 2) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Validation du format des données via un schéma Zod
			const validation = userUpdateSchema.safeParse(newModifiedData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si une adresse mail est fournie, vérification si elle n'est pas déjà utilisée
			if (newModifiedData.email) {
				// Si l'utilisateur existe déjà
				if (
					table
						.getCoreRowModel()
						.rows.some(
							(row) =>
								row.original.email.toLowerCase() ===
									newData.email.toLowerCase().trim() &&
								row.original.id !== newData.id
						)
				) {
					toast.error(
						'Un utilisateur avec cette adresse mail existe déjà'
					);
					return setValidationErrors({
						email: ' ',
					});
				}
			}

			updateUser(newModifiedData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

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
				deleteFunction={() =>
					displayDeleteUserModal({ row, deleteUser })
				}
				resetPasswordFunction={() =>
					displayUserPasswordResetModal({ row, resetPassword })
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
