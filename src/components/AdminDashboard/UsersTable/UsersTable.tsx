import {
	ActionIcon,
	Badge,
	Button,
	Flex,
	Loader,
	Text,
	Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCopy, IconMail } from '@tabler/icons-react';
import { sendEmail } from '@utils/functions';
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
import { UserPasswordIsResetType, UserType } from '../../../types/user';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import EditDeleteResetPasswordButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteResetPasswordButtons';

export default function UsersTable() {
	const { data: users, isLoading, isError } = useGetAllUsers();
	const { mutate: createUser } = useCreateUser();
	const { mutate: updateUser } = useUpdateUser();
	const { mutate: resetPassword } = useResetPassword(openConfirmationModal);
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

	//RESET PASSWORD action
	const openResetPasswordConfirmModal = (row: MRT_Row<UserType>) =>
		modals.openConfirmModal({
			title: "Réinitialisation du mot de passe d'un utilisateur",
			children: (
				<Text>
					Voulez-vous vraiment réinitialiser le mot de passe de
					l'utilisateur{' '}
					<span className='bold-text'>
						{row.original.firstName} {row.original.lastName}
					</span>{' '}
					?
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Réinitialiser', cancel: 'Annuler' },
			confirmProps: { color: 'orange' },
			onConfirm: () => resetPassword({ id: row.original.id }),
		});

	// RESET PASSWORD modale de confirmation
	function openConfirmationModal(user: UserPasswordIsResetType) {
		modals.open({
			title: 'Confirmation de la réinitialisation',
			children: (
				<>
					<Text>
						Le mot de passe de{' '}
						<span className='bold-text'>{user.fullName}</span> a
						bien été réinitialisé.
					</Text>
					<Text>Le nouveau mot de passe à fournir est : </Text>
					<Flex gap='md' my='lg' justify='center' align='center'>
						<Text>{user.generatedPassword}</Text>
						<Tooltip label='Copier dans le presse-papiers'>
							<ActionIcon
								onClick={() => {
									navigator.clipboard.writeText(
										user.generatedPassword
									);
									toast.info(
										'Mot de passe copié dans le presse-papiers'
									);
								}}
							>
								<IconCopy />
							</ActionIcon>
						</Tooltip>
						<Tooltip label='Envoyer par e-mail'>
							<ActionIcon
								onClick={() =>
									sendEmail(
										user.email,
										'Réinitialisation de votre mot de passe sur Gestion-SMAC',
										`Bonjour ${user.fullName},\r\rVotre mot de passe a été réinitialisé.\r\rVous pouvez désormais vous connecter avec le nouveau : ${user.generatedPassword}\r\r`
									)
								}
							>
								<IconMail />
							</ActionIcon>
						</Tooltip>
					</Flex>
					<Button fullWidth onClick={() => modals.closeAll()}>
						OK
					</Button>
				</>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
		});
	}

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
		paginationDisplayMode: 'pages',
		renderRowActions: ({ row, table }) => (
			<EditDeleteResetPasswordButtons
				rowEmail={row.original.email}
				rowId={row.original.id}
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
				resetPasswordFunction={() => openResetPasswordConfirmModal(row)}
			/>
		),
		renderTopToolbarCustomActions: ({ table }) => (
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
