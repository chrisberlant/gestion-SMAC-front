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
import {
	IconEdit,
	IconTrash,
	IconKey,
	IconEditOff,
	IconKeyOff,
	IconTrashOff,
	IconCopy,
	IconMail,
} from '@tabler/icons-react';
import {
	userUpdateSchema,
	userCreationSchema,
} from '@validationSchemas/userSchemas';
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
	useResetPassword,
	useUpdateUser,
} from '@utils/userQueries';
import { sendEmail } from '@utils/functions';
import { toast } from 'sonner';

function UsersTable() {
	const { data: currentUser } = useGetCurrentUser();
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
				accessorKey: 'isAdmin',
				accessorFn: (row: UserType) => {
					if (row.isAdmin) return 'Admin';
					return 'Tech';
				},
				editVariant: 'select',
				Cell: ({ row }) => (
					<Badge
						color={row.original.isAdmin ? 'red' : 'blue'}
						variant='light'
					>
						{row.original.isAdmin ? 'Admin' : 'Tech'}
					</Badge>
				),
				mantineEditSelectProps: {
					data: ['Tech', 'Admin'], // Options disponibles dans le menu déroulant
					error: validationErrors?.isAdmin,
					searchable: false, // Désactiver la recherche
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
			if (values.isAdmin === 'Admin') values.isAdmin = true;
			else values.isAdmin = false;
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
			// Conversion en booléen du rôle
			if (values.isAdmin === 'Admin') values.isAdmin = true;
			else values.isAdmin = false;
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
	function openConfirmationModal(user: {
		fullName: string;
		email: string;
		generatedPassword: string;
	}) {
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
					<span className='users-title'>
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
					<Tooltip label='Réinitialiser le mot de passe'>
						<ActionIcon
							color='orange'
							onClick={() => openResetPasswordConfirmModal(row)}
							size='sm'
						>
							<IconKey />
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
				// Les options d'édition sont grisées pour l'utilisateur actuel et l'utilisateur root
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
							<IconEditOff />
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
							<IconKeyOff />
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
							<IconTrashOff />
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
		<div className='users-table'>
			<h2>Utilisateurs et droits</h2>
			<MantineReactTable table={table} />
		</div>
	);
}

export default UsersTable;
