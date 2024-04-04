import { Loader } from '@mantine/core';
import {
	useCreateModel,
	useDeleteModel,
	useGetAllModels,
	useUpdateModel,
} from '@queries/modelQueries';
import {
	modelCreationSchema,
	modelUpdateSchema,
} from '@validationSchemas/modelSchemas';
import {
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { ModelType, ModelUpdateType } from '@customTypes/model';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import EditDeleteButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import { toast } from 'sonner';
import displayModelDeleteModal from '@modals/modelDeleteModal';
import { objectIncludesObject, optimizeData } from '../../../utils';

export default function ModelsTable() {
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
				size: 120,
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
			// Si le modèle existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.brand.toLowerCase() ===
								values.brand.toLowerCase().trim() &&
							row.original.reference.toLowerCase() ===
								values.reference.toLowerCase().trim() &&
							row.original.storage?.toLowerCase() ===
								values.storage?.toLowerCase().trim()
					)
			) {
				toast.error('Un modèle identique existe déjà');
				return setValidationErrors({
					brand: ' ',
					reference: ' ',
					storage: ' ',
				});
			}

			setValidationErrors({});
			createModel(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveModel: MRT_TableOptions<ModelType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const { brand, reference, storage } = values;

			// Formatage des données
			const newData = {
				brand,
				reference,
				storage,
			} as ModelType;

			const { ...originalData } = row.original;

			// Si aucune modification des données
			if (objectIncludesObject(originalData, newData)) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Optimisation pour envoyer uniquement les données modifiées
			const newOptimizedData = optimizeData(
				originalData,
				newData
			) as ModelUpdateType;
			// Récupérer l'id dans les colonnes cachées
			newOptimizedData.id = originalData.id;

			// Validation du format des données via un schéma Zod
			const validation = modelUpdateSchema.safeParse(newOptimizedData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si le modèle existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.brand.toLowerCase() ===
								newData.brand.toLowerCase().trim() &&
							row.original.reference.toLowerCase() ===
								newData.reference.toLowerCase().trim() &&
							row.original.storage?.toLowerCase() ===
								newData.storage?.toLowerCase().trim() &&
							row.original.id !== newOptimizedData.id
					)
			) {
				toast.error('Un modèle identique existe déjà');
				return setValidationErrors({
					brand: ' ',
					reference: ' ',
					storage: ' ',
				});
			}

			updateModel(newOptimizedData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

	const table = useMantineReactTable({
		columns,
		data: models || [],
		enableGlobalFilter: true,
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
		mantineSearchTextInputProps: {
			placeholder: 'Rechercher',
			// style: { minWidth: '100px' },
			variant: 'default',
		},
		paginationDisplayMode: 'pages',
		mantineTableContainerProps: { style: { minWidth: '40vw' } },
		renderRowActions: ({ row, table }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() =>
					displayModelDeleteModal({ row, deleteModel })
				}
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
		<div className='models-table'>
			<h2>Modèles d'appareils</h2>

			{isLoading && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{isError && (
				<span>
					Impossible de récupérer les modèles depuis le serveur
				</span>
			)}

			{models && <MantineReactTable table={table} />}
		</div>
	);
}
