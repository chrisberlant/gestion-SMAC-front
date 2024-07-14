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
import { ServiceCreationType, ServiceType } from '@customTypes/service';
import EditDeleteButtons from '../../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../../TableActionsButtons/CreateButton/CreateButton';
import { toast } from 'sonner';
import displayServiceDeleteModal from '@modals/serviceDeleteModal';
import Loading from '../../Loading/Loading';
import { virtualizedTableConfig } from '@utils/tableConfig';

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
				minSize: 500,
				accessorKey: 'title',
				mantineEditTextInputProps: {
					style: {
						width: 500,
					},
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
			// Formatage des données
			const creationData = {
				title: values.title.trim(),
			} as ServiceCreationType;

			const validation = serviceCreationSchema.safeParse(creationData);
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
							creationData.title.toLowerCase()
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
			const { ...originalData } = row.original;

			// Formatage des données
			const updateData = {
				id: originalData.id,
				title: values.title.trim(),
			} as ServiceType;

			// Si aucune modification des données
			if (updateData.title === originalData.title) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Validation du format des données via un schéma Zod
			const validation = serviceUpdateSchema.safeParse(updateData);
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
								updateData.title.toLowerCase() &&
							row.original.id !== updateData.id
					)
			) {
				toast.error('Un service porte déjà ce nom');
				return setValidationErrors({
					title: ' ',
				});
			}

			updateService(updateData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

	const table = useMantineReactTable({
		...virtualizedTableConfig,
		enableColumnOrdering: false,
		initialState: {
			density: 'xs',
			columnVisibility: {
				id: false,
			},
		},
		columns,
		data: services ?? [],
		enableColumnFilters: false,
		renderBottomToolbar: false,
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateService,
		onEditingRowSave: handleSaveService,
		onEditingRowCancel: () => setValidationErrors({}),
		renderRowActions: ({ row }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() =>
					displayServiceDeleteModal({
						serviceId: row.original.id,
						serviceTitle: row.original.title,
						deleteService,
					})
				}
			/>
		),
		renderTopToolbarCustomActions: () => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
		),
	});

	return (
		<div>
			<h2>Services</h2>

			{isLoading && <Loading />}

			{isError && (
				<span>
					Impossible de récupérer les services depuis le serveur
				</span>
			)}

			{services && <MantineReactTable table={table} />}
		</div>
	);
}
