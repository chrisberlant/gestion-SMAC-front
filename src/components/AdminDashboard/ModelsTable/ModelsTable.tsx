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
import {
	ModelCreationType,
	ModelType,
	ModelUpdateType,
} from '@customTypes/model';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import EditDeleteButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import { toast } from 'sonner';
import displayModelDeleteModal from '@modals/modelDeleteModal';
import { getModifiedValues } from '@utils/index';
import Loading from '../../Loading/Loading';
import { paginatedTableConfig } from '@utils/tableConfig';

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
			const { brand, reference, storage } = values;

			// Formatage des données
			const creationData = {
				brand: brand.trim(),
				reference: reference.trim(),
				storage: storage.trim(),
			} as ModelCreationType;

			const validation = modelCreationSchema.safeParse(creationData);
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
								creationData.brand.toLowerCase() &&
							row.original.reference.toLowerCase() ===
								creationData.reference.toLowerCase() &&
							row.original.storage?.toLowerCase() ===
								creationData.storage?.toLowerCase()
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
			const { ...originalData } = row.original;

			// Formatage des données
			const updateData = {
				id: originalData.id,
				brand: brand.trim(),
				reference: reference.trim(),
				storage: storage.trim(),
			} as ModelType;

			// Optimisation pour envoyer uniquement les données modifiées
			const newModifiedData = getModifiedValues(
				originalData,
				updateData
			) as ModelUpdateType;

			// Si aucune modification des données
			if (Object.keys(newModifiedData).length < 2) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Validation du format des données via un schéma Zod
			const validation = modelUpdateSchema.safeParse(newModifiedData);
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
								updateData.brand.toLowerCase() &&
							row.original.reference.toLowerCase() ===
								updateData.reference.toLowerCase() &&
							row.original.storage?.toLowerCase() ===
								updateData.storage?.toLowerCase() &&
							row.original.id !== updateData.id
					)
			) {
				toast.error('Un modèle identique existe déjà');
				return setValidationErrors({
					brand: ' ',
					reference: ' ',
					storage: ' ',
				});
			}

			updateModel(newModifiedData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

	const table = useMantineReactTable({
		...paginatedTableConfig,
		columns,
		data: models || [],
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateModel,
		onEditingRowSave: handleSaveModel,
		onEditingRowCancel: () => setValidationErrors({}),

		renderRowActions: ({ row, table }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() =>
					displayModelDeleteModal({
						modelId: row.original.id,
						modelFullName: `${row.original.brand} ${
							row.original.reference
						} ${
							row.original.storage
								? `de stockage ${row.original.storage}`
								: ''
						}`,
						deleteModel,
					})
				}
			/>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
		),
	});

	return (
		<div className='models-table'>
			<h2>Modèles d'appareils</h2>

			{isLoading && <Loading />}

			{isError && (
				<span>
					Impossible de récupérer les modèles depuis le serveur
				</span>
			)}

			{models && <MantineReactTable table={table} />}
		</div>
	);
}
