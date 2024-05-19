import { Badge } from '@mantine/core';
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
import { UserCreationType, UserType, UserUpdateType } from '@customTypes/user';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import EditDeleteResetPasswordButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteResetPasswordButtons';
import { displayUserPasswordResetModal } from '@modals/userPasswordResetModal';
import displayUserPasswordResetConfirmModal from '@modals/userPasswordResetConfirmModal';
import displayDeleteUserModal from '@modals/userDeleteModal';
import displayUserCreationConfirmModal from '../../../modals/userCreationConfirmModal';
import { getModifiedValues } from '@utils/index';
import Loading from '../../Loading/Loading';
import { virtualizedTableConfig } from '@utils/tableConfig';

export default function UsersTable() {
	const { data: users, isLoading, isError } = useGetAllUsers();
	const { mutate: createUser } = useCreateUser(
		displayUserCreationConfirmModal
	);
	const { mutate: updateUser } = useUpdateUser();
	const { mutate: resetPassword } = useResetPassword(
		displayUserPasswordResetConfirmModal
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
				minSize: 150,
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
				minSize: 150,
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
				maxSize: 135,
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
				minSize: 300,
				maxSize: 400,
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
			const { lastName, firstName, email, role } = values;

			// Formatage des données
			const creationData = {
				lastName: lastName.trim(),
				firstName: firstName.trim(),
				email: email.trim().toLowerCase(),
				role,
			} as UserCreationType;

			const validation = userCreationSchema.safeParse(creationData);
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
						(row) => row.original.email === creationData.email
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
			const updateData = {
				id: originalData.id,
				lastName: lastName.trim(),
				firstName: firstName.trim(),
				email: email.trim().toLowerCase(),
				role,
			} as UserType;

			// Optimisation pour envoyer uniquement les données modifiées
			const newModifiedData = getModifiedValues(
				originalData,
				updateData
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
									updateData.email &&
								row.original.id !== updateData.id
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
		...virtualizedTableConfig,
		initialState: {
			sorting: [{ id: 'id', desc: false }],
			density: 'xs',
			pagination: {
				pageIndex: 0,
				pageSize: 10,
			},
			columnVisibility: {
				id: false,
			},
		},
		columns,
		data: users || [],
		renderBottomToolbar: false,
		mantineTableContainerProps: {
			style: { maxHeight: '30vh' },
		},
		displayColumnDefOptions: {
			'mrt-row-actions': {
				size: 120,
			},
		},
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateUser,
		onEditingRowSave: handleSaveUser,
		onEditingRowCancel: () => setValidationErrors({}),
		renderRowActions: ({ row }) => (
			<EditDeleteResetPasswordButtons
				rowEmail={row.original.email}
				rowId={row.original.id}
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() =>
					displayDeleteUserModal({
						userId: row.original.id,
						userFullName: `${row.original.firstName} ${row.original.lastName}`,
						deleteUser,
					})
				}
				resetPasswordFunction={() =>
					displayUserPasswordResetModal({ row, resetPassword })
				}
			/>
		),
		renderTopToolbarCustomActions: () => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
		),
	});

	return (
		<div>
			<h2>Utilisateurs et droits</h2>

			{isLoading && <Loading />}

			{isError && (
				<span>
					Impossible de récupérer les utilisateurs depuis le serveur
				</span>
			)}

			{users && <MantineReactTable table={table} />}
		</div>
	);
}
