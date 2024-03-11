import { Loader, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import {
	useCreateService,
	useDeleteService,
	useGetAllServices,
	useUpdateService,
} from '@/queries/serviceQueries';
import {
	serviceCreationSchema,
	serviceUpdateSchema,
} from '@validationSchemas/serviceSchemas';
import {
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { ServiceType } from '../../../types/service';
import EditDeleteButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import { toast } from 'sonner';

export default function ServicesTable() {
	const { data: services, isLoading, isError } = useGetAllServices();
	const { mutate: createService } = useCreateService();
	const { mutate: updateService } = useUpdateService();
	const { mutate: deleteService } = useDeleteService();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const columns = useMemo<MRT_ColumnDef<ServiceType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
			},
			{
				header: 'Titre',
				accessorKey: 'title',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.title,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							title: undefined,
						}),
				},
			},
		],
		[validationErrors]
	);

	//CREATE action
	const handleCreateService: MRT_TableOptions<ServiceType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const validation = serviceCreationSchema.safeParse(values);
			if (!validation.success) {
				return setValidationErrors({
					title: validation.error.issues[0].message,
				});
			}

			// Si le service existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.title.toLocaleLowerCase() ===
							values.title.toLocaleLowerCase().trim()
					)
			) {
				toast.error('Un service porte déjà ce nom');
				return setValidationErrors({
					title: ' ',
				});
			}

			setValidationErrors({});
			createService(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveService: MRT_TableOptions<ServiceType>['onEditingRowSave'] =
		async ({ values, table, row }) => {
			// Récupérer l'id dans les colonnes cachées et l'ajouter aux données à valider
			values.id = row.original.id;
			// Validation du format des données via un schéma Zod
			const validation = serviceUpdateSchema.safeParse(values);
			if (!validation.success) {
				return setValidationErrors({
					title: validation.error.issues[0].message,
				});
			}

			// Si le service existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.title.toLocaleLowerCase() ===
							values.title.toLocaleLowerCase().trim()
					)
			) {
				toast.error('Un service porte déjà ce nom');
				return setValidationErrors({
					title: ' ',
				});
			}

			setValidationErrors({});
			updateService(values);
			table.setEditingRow(null);
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<ServiceType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un service",
			children: (
				<Text>
					Voulez-vous vraiment supprimer le service{' '}
					<span className='bold-text'>{row.original.title}</span> ?
					Cette action est irréversible.
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteService({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: services || [],
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
		onCreatingRowSave: handleCreateService,
		onEditingRowSave: handleSaveService,
		onEditingRowCancel: () => setValidationErrors({}),
		paginationDisplayMode: 'pages',
		renderRowActions: ({ row, table }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
				roleCheck={false}
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
				pageSize: 10, // rows per page
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
		<div className='services-table'>
			<h2>Services</h2>

			{isLoading && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{isError && (
				<span>
					Impossible de récupérer les services depuis le serveur
				</span>
			)}

			{services && <MantineReactTable table={table} />}
		</div>
	);
}
