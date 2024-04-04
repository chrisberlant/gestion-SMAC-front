import { Loader } from '@mantine/core';
import {
	useCreateService,
	useDeleteService,
	useGetAllServices,
	useUpdateService,
} from '@queries/serviceQueries';
import {
	serviceCreationSchema,
	serviceUpdateSchema,
} from '@validationSchemas/serviceSchemas';
import {
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { ServiceType } from '@customTypes/service';
import EditDeleteButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import { toast } from 'sonner';
import displayServiceDeleteModal from '@modals/serviceDeleteModal';

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
							row.original.title.toLowerCase() ===
							values.title.toLowerCase().trim()
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
			const { title } = values;

			// Formatage des données
			const newData = {
				title,
			} as ServiceType;

			const { ...originalData } = row.original;

			// Si aucune modification des données
			if (newData.title === originalData.title) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Récupérer l'id dans les colonnes cachées
			newData.id = originalData.id;

			// Validation du format des données via un schéma Zod
			const validation = serviceUpdateSchema.safeParse(newData);
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
							row.original.title.toLowerCase() ===
								newData.title.toLowerCase().trim() &&
							row.original.id !== newData.id
					)
			) {
				toast.error('Un service porte déjà ce nom');
				return setValidationErrors({
					title: ' ',
				});
			}

			updateService(newData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

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
		mantineSearchTextInputProps: {
			placeholder: 'Rechercher',
			// style: { minWidth: '100px' },
			variant: 'default',
		},
		paginationDisplayMode: 'pages',
		mantineTableContainerProps: { style: { minWidth: '20vw' } },
		renderRowActions: ({ row }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() =>
					displayServiceDeleteModal({ row, deleteService })
				}
				roleCheck={false}
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
