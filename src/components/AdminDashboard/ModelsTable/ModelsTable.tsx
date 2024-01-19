import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { ModelType } from '../../../types';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
	modelUpdateSchema,
	modelCreationSchema,
} from '@validationSchemas/modelSchemas';
import { Flex, Tooltip, ActionIcon, Text, Button, Loader } from '@mantine/core';
import {
	useCreateModel,
	useDeleteModel,
	useGetAllModels,
	useUpdateModel,
} from '@utils/modelQueries';

function ModelsTable() {
	const { data: models, isLoading, isError } = useGetAllModels();
	const { mutate: createModel } = useCreateModel();
	const { mutate: updateModel } = useUpdateModel();
	const { mutate: deleteModel } = useDeleteModel();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const columns = useMemo<MRT_ColumnDef<ModelType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
			},
			{
				header: 'Marque',
				accessorKey: 'brand',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.brand,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							brand: undefined,
						}),
				},
			},
			{
				header: 'Modèle',
				accessorKey: 'reference',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.reference,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							reference: undefined,
						}),
				},
			},
			{
				header: 'Stockage',
				accessorKey: 'storage',
				mantineEditTextInputProps: {
					required: true,
					error: validationErrors?.storage,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							storage: undefined,
						}),
				},
			},
		],
		[validationErrors]
	);

	//CREATE action
	const handleCreateModel: MRT_TableOptions<ModelType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const validation = modelCreationSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			createModel(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveModel: MRT_TableOptions<ModelType>['onEditingRowSave'] =
		async ({ values, table, row }) => {
			// Récupérer l'id dans les colonnes cachées et l'ajouter aux données à valider
			values.id = row.original.id;
			// Validation du format des données via un schéma Zod
			const validation = modelUpdateSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			updateModel(values);
			table.setEditingRow(null);
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<ModelType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un modèle",
			children: (
				<Text>
					Voulez-vous vraiment supprimer le modèle{' '}
					<span className='bold-text'>
						{`${row.original.brand} ${row.original.reference} ${
							row.original.storage
								? `de stockage ${row.original.storage}`
								: ''
						}`}
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
			onConfirm: () => deleteModel({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: models || [],
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
		onCreatingRowSave: handleCreateModel,
		onEditingRowSave: handleSaveModel,
		onEditingRowCancel: () => setValidationErrors({}),
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
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);
	}
	if (isError) {
		return <div>Impossible de récupérer les modèles depuis le serveur</div>;
	}

	return (
		<div className='models-table'>
			<h2>Modèles d'appareils</h2>
			<MantineReactTable table={table} />
		</div>
	);
}

export default ModelsTable;
