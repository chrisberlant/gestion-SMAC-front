import {
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
import { serviceUpdateSchema } from '@validationSchemas/serviceSchemas';
import { Flex, Tooltip, ActionIcon } from '@mantine/core';

function ServicesTable3() {
	const { data: services, isLoading, isError } = useGetAllServices();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const { mutateAsync: updateService } = useUpdateService();
	const { mutateAsync: deleteService } = useDeleteService();

	const columns = useMemo<MRT_ColumnDef<ServiceType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				enableEditing: false,
				required: true,
				size: 80,
			},
			{
				header: 'Titre',
				accessorKey: 'title',
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

	//UPDATE action
	const handleSaveService: MRT_TableOptions<ServiceType>['onEditingRowSave'] =
		async ({ values, table }) => {
			console.log(values);
			const validation = serviceUpdateSchema.safeParse(values);
			if (!validation.success) {
				console.log(validation.error.issues);
				setValidationErrors({ id: '', title: 'Titre requis' });
				return;
			}
			setValidationErrors({});
			await updateService(values);
			table.setEditingRow(null); //exit editing mode
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<ServiceType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un service",
			children: (
				<p>
					Voulez-vous vraiment supprimer le service{' '}
					{row.original.title} ? Cette action est irréversible.
				</p>
			),
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteService({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: services || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
		enableGlobalFilter: true,
		enableColumnFilters: false,
		enableColumnActions: false,
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		enableHiding: false,
		enableDensityToggle: false,
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
		initialState: {
			pagination: {
				pageIndex: 0, // page start
				pageSize: 10, // rows per page
			},
			columnVisibility: {
				// id: false,
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
