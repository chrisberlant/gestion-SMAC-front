import {
	useCreateService,
	useDeleteService,
	useGetAllServices,
	useUpdateService,
} from '@utils/serviceQueries';
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { ServiceType } from '../../../types';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
	serviceCreationSchema,
	serviceUpdateSchema,
} from '@validationSchemas/serviceSchemas';
import { Flex, Tooltip, ActionIcon, Text, Button } from '@mantine/core';
import './servicesTable.css';

function ServicesTable3() {
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
				accessorKey: 'id',
				header: 'Id',
				enableEditing: false,
				required: true,
				size: 80,
			},
			{
				accessorKey: 'title',
				header: 'Titre',
				show: false,
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
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			createService(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveService: MRT_TableOptions<ServiceType>['onEditingRowSave'] =
		async ({ values, table, row }) => {
			console.log('tentative update');
			// Récupérer l'id dans les colonnes cachées
			values.id = row.original.id;
			// Validation du format des données via un schéma Zod
			const validation = serviceUpdateSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
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
					<span className='service-title'>{row.original.title}</span>{' '}
					? Cette action est irréversible.
				</Text>
			),
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
			<Flex gap='md'>
				<Tooltip label='Modifier'>
					<ActionIcon onClick={() => table.setEditingRow(row)}>
						<IconEdit />
					</ActionIcon>
				</Tooltip>
				<Tooltip label='Supprimer'>
					<ActionIcon
						color='red'
						onClick={() => openDeleteConfirmModal(row)}
					>
						<IconTrash />
					</ActionIcon>
				</Tooltip>
			</Flex>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button onClick={() => table.setCreatingRow(true)}>
				Créer nouveau service
			</Button>
		),
		initialState: {
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

	if (isLoading) {
		return <div>Chargement...</div>;
	}
	if (isError) {
		return <div>Erreur</div>;
	}

	return (
		<div className='services-table'>
			<MantineReactTable table={table} />
		</div>
	);
}

export default ServicesTable3;
