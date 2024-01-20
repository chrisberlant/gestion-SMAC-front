import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { AgentType, LineType, ServiceType } from '../../types';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Flex, Tooltip, ActionIcon, Text, Button, Loader } from '@mantine/core';
// import { toast } from 'sonner';
import {
	useCreateLine,
	useGetAllAttributedLines,
} from '../../utils/lineQueries';
import { lineCreationSchema } from '../../validationSchemas/lineSchemas';
import { useGetAllServices } from '../../utils/serviceQueries';

interface ValidationErrorsType {
	number: undefined | string;
	profile: undefined | string;
	status: undefined | string;
	comments: undefined | string;
	agent: {
		email: undefined | string;
		firstName: undefined | string;
		lastName: undefined | string;
		service: {
			title: undefined | string;
		};
	};
	device: {
		imei: undefined | string;
		preparationDate: undefined | string;
		attributionDate: undefined | string;
		status: undefined | string;
		isNew: undefined | string;
		comments: undefined | string;
		model: {
			brand: undefined | string;
			reference: undefined | string;
			storage: undefined | string;
		};
	};
}

function AttributedLines2() {
	const { data: lines, isLoading, isError } = useGetAllAttributedLines();
	const { data: services } = useGetAllServices();
	const { mutate: createLine } = useCreateLine();
	const initialState = {
		number: undefined,
		profile: undefined,
		status: undefined,
		comments: undefined,
		agent: {
			email: undefined,
			firstName: undefined,
			lastName: undefined,
			service: {
				title: undefined,
			},
		},
		device: {
			imei: undefined,
			preparationDate: undefined,
			attributionDate: undefined,
			status: undefined,
			isNew: undefined,
			comments: undefined,
			model: {
				brand: undefined,
				reference: undefined,
				storage: undefined,
			},
		},
	};
	const [validationErrors, setValidationErrors] =
		useState<ValidationErrorsType>(initialState);

	const columns = useMemo<MRT_ColumnDef<LineType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				enableEditing: false,
			},
			{
				header: 'Numéro',
				accessorKey: 'number',
				mantineEditTextInputProps: {
					error: validationErrors?.number,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							number: undefined,
						}),
				},
			},
			{
				header: 'Profil',
				accessorKey: 'profile',
				editVariant: 'select',
				size: 90,
				mantineEditSelectProps: {
					data: ['VD', 'V', 'D'], // Options disponibles dans le menu déroulant
					error: validationErrors?.profile,
					searchable: true, // Désactiver la recherche
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							profile: undefined,
						}),
				},
			},
			{
				header: 'Statut',
				accessorKey: 'status',
				editVariant: 'select',
				size: 150,
				mantineEditSelectProps: {
					data: ['Attribuée', 'En cours', 'Résiliée'],
					error: validationErrors?.status,
					searchable: false,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							status: undefined,
						}),
				},
			},
			{
				header: 'Commentaires',
				accessorKey: 'comments',
				mantineEditTextInputProps: {
					error: validationErrors?.comments,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							comments: undefined,
						}),
				},
			},
			{
				header: 'Email',
				accessorKey: 'agent.email',
				mantineEditTextInputProps: {
					error: validationErrors?.agent?.email,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							comments: undefined,
						}),
				},
			},
			{
				header: 'Nom',
				accessorKey: 'agent.lastName',
				mantineEditTextInputProps: {
					error: validationErrors?.agent.lastName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							agent: {
								...validationErrors.agent,
								lastName: undefined,
							},
						}),
				},
			},
			{
				header: 'Prénom',
				accessorKey: 'agent.firstName',
				mantineEditTextInputProps: {
					error: validationErrors?.agent.firstName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							agent: {
								...validationErrors.agent,
								firstName: undefined,
							},
						}),
				},
			},
			{
				header: 'Service',
				accessorKey: 'agent.service.title',
				editVariant: 'select',
				mantineEditSelectProps: {
					data: ['VD', 'V', 'D'],
					error: validationErrors?.agent.service.title,
					searchable: true,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							agent: {
								...validationErrors.agent,
								service: {
									title: undefined,
								},
							},
						}),
				},
			},
		],
		[validationErrors]
	);

	//CREATE action
	const handleCreateUser: MRT_TableOptions<LineType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const validation = lineCreationSchema.safeParse(values);
			if (!validation.success) {
				console.log(validation.error.issues);
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				// validation.error.issues.forEach((item) => {
				// 	errors[item.path[0]] = item.message;
				// });
				// return setValidationErrors(errors);
			}
			// setValidationErrors({});
			// createUser(values);
			exitCreatingMode();
		};

	//UPDATE action
	// const handleSaveUser: MRT_TableOptions<LineType>['onEditingRowSave'] =
	// 	async ({ values, table, row }) => {
	// 		// Récupérer l'id dans les colonnes cachées et l'ajouter aux données à valider
	// 		values.id = row.original.id;
	// 		// Validation du format des données via un schéma Zod
	// 		const validation = userUpdateSchema.safeParse(values);
	// 		if (!validation.success) {
	// 			const errors: Record<string, string> = {};
	// 			validation.error.issues.forEach((item) => {
	// 				errors[item.path[0]] = item.message;
	// 			});
	// 			return setValidationErrors(errors);
	// 		}
	// 		setValidationErrors({});
	// 		// updateUser(values);
	// 		table.setEditingRow(undefined);
	// 	};

	//RESET PASSWORD action
	// const openResetPasswordConfirmModal = (row: MRT_Row<UserType>) =>
	// 	modals.openConfirmModal({
	// 		title: "Réinitialisation du mot de passe d'un utilisateur",
	// 		children: (
	// 			<Text>
	// 				Voulez-vous vraiment réinitialiser le mot de passe de
	// 				l'utilisateur{' '}
	// 				<span className='bold-text'>
	// 					{row.original.firstName} {row.original.lastName}
	// 				</span>{' '}
	// 				?
	// 			</Text>
	// 		),
	// 		centered: true,
	// 		overlayProps: {
	// 			blur: 3,
	// 		},
	// 		labels: { confirm: 'Réinitialiser', cancel: 'Annuler' },
	// 		confirmProps: { color: 'orange' },
	// 		onConfirm: () => resetPassword({ id: row.original.id }),
	// 	});

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<LineType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un utilisateur",
			children: (
				<Text>
					Voulez-vous vraiment supprimer la ligne{' '}
					<span className='bold-text'>{row.original.number}</span> ?
					Cette action est irréversible.
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			// onConfirm: () => deleteUser({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: lines || [],
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
		onCreatingRowCancel: () => setValidationErrors(initialState),
		onCreatingRowSave: handleCreateUser,
		// onEditingRowSave: handleSaveUser,
		onEditingRowCancel: () => setValidationErrors(initialState),
		paginationDisplayMode: 'pages',
		renderRowActions: ({ row, table }) => (
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
				pageSize: 20, // rows per page
			},
			columnVisibility: {
				id: false,
			},
		},
		mantinePaginationProps: {
			rowsPerPageOptions: ['20', '50', '100', '200'],
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
		<div>
			<h2>Lignes attribuées</h2>
			<MantineReactTable table={table} />
		</div>
	);
}

export default AttributedLines2;
