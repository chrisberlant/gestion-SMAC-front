import { Flex, Loader, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import 'dayjs/locale/fr';
import {
	MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import { useMemo, useRef, useState } from 'react';
import {
	DeviceCreationType,
	DeviceType,
	DeviceUpdateType,
} from '../../types/device';
import { useGetAllAgents } from '../../queries/agentQueries';
import {
	useCreateDevice,
	useDeleteDevice,
	useExportDevicesToCsv,
	useGetAllDevices,
	useUpdateDevice,
} from '../../queries/deviceQueries';
import { useGetAllModels } from '../../queries/modelQueries';
import { useGetAllServices } from '../../queries/serviceQueries';
import {
	deviceCreationSchema,
	deviceUpdateSchema,
} from '../../validationSchemas/deviceSchemas';
import '@mantine/dates/styles.css';
import { dateFrFormatting } from '../../utils/functions';
import SwitchButton from '../SwitchButton/SwitchButton';
import DateChoice from '../DateChoice/DateChoice';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import { useGetAllLines } from '../../queries/lineQueries';
import displayDeviceOwnerChangeModal from '../../modals/deviceOwnerChangeModal';
import ExportToCsvButton from '../ExportToCsvButton/ExportToCsvButton';
import { toast } from 'sonner';

export default function DevicesTable() {
	const {
		data: services,
		isLoading: servicesLoading,
		isError: servicesError,
	} = useGetAllServices();
	const {
		data: agents,
		isLoading: agentsLoading,
		isError: agentsError,
	} = useGetAllAgents();
	const {
		data: devices,
		isLoading: devicesLoading,
		isError: devicesError,
	} = useGetAllDevices();
	const {
		data: models,
		isLoading: modelsLoading,
		isError: modelsError,
	} = useGetAllModels();
	const {
		data: lines,
		isLoading: linesLoading,
		isError: linesError,
	} = useGetAllLines();
	const { mutate: createDevice } = useCreateDevice();
	const { mutate: updateDevice } = useUpdateDevice();
	const { mutate: deleteDevice } = useDeleteDevice();
	const { refetch: exportsDevicesToCsv } = useExportDevicesToCsv();

	const anyLoading =
		servicesLoading ||
		devicesLoading ||
		agentsLoading ||
		modelsLoading ||
		linesLoading;
	const anyError =
		servicesError ||
		devicesError ||
		agentsError ||
		modelsError ||
		linesError;
	const allData = devices && services && agents && models;

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	// Ref permettant de récupérer les valeurs des enfants
	const preparationDateRef = useRef<string>('');
	const attributionDateRef = useRef<string>('');
	const isNewRef = useRef<boolean>(true);

	// Récupération des informations des agents formatées sous forme d'un objet contenant leurs infos importantes ainsi que leurs id
	const formattedAgents = useMemo(
		() =>
			agents?.map((agent) => {
				const serviceTitle = services?.find(
					(service) => service.id === agent.serviceId
				)?.title;

				return {
					infos: `${agent.lastName} ${agent.firstName} - ${serviceTitle}`,
					vip: agent.vip,
					email: agent.email,
					id: agent.id,
				};
			}),
		[agents, services]
	);

	// La même chose pour les modèles
	const formattedModels = useMemo(
		() =>
			models?.map((model) => ({
				infos: `${model.brand} ${model.reference}${
					model.storage ? ` ${model.storage}` : ''
				}`,
				id: model.id,
			})),
		[models]
	);

	const columns = useMemo<MRT_ColumnDef<DeviceType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				enableEditing: false,
			},
			{
				header: 'IMEI',
				accessorKey: 'imei',
				size: 80,
				mantineEditTextInputProps: {
					error: validationErrors?.imei,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							imei: undefined,
						}),
				},
				enableClickToCopy: true,
			},
			{
				header: 'Statut',
				id: 'status',
				accessorFn: (row) => row.status || 'En stock',
				size: 150,
				editVariant: 'select',
				mantineEditSelectProps: {
					data: [
						'En stock',
						'Attribué',
						'Restitué',
						'En attente de restitution',
						'En prêt',
						'En panne',
						'Volé',
					],
					allowDeselect: false,
					error: validationErrors?.status,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							status: undefined,
						}),
				},
			},
			{
				header: 'État',
				accessorKey: 'isNew',
				size: 100,
				mantineEditTextInputProps: {
					error: validationErrors?.isNew,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							isNew: undefined,
						}),
				},
				Edit: ({ row }) => {
					// Bouton sur "Neuf" par défaut lors de la création (donc imei vide)
					const defaultValue =
						row.original.isNew || !row.original.imei ? true : false;
					return (
						<SwitchButton
							size='lg'
							defaultValue={defaultValue}
							valueRef={isNewRef}
							onLabel='Neuf'
							offLabel='Occasion'
						/>
					);
				},
				Cell: ({ cell }) =>
					cell.getValue() === false ? 'Occasion' : 'Neuf',
			},
			{
				header: 'Modèle',
				id: 'modelId',
				accessorFn: (row) => {
					const currentModel = models?.find(
						(model) => model.id === row.modelId
					);
					return `${currentModel?.brand} ${currentModel?.reference}${
						currentModel?.storage ? ` ${currentModel.storage}` : ''
					}`;
				},
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: formattedModels?.map((model) => model.infos),
					allowDeselect: false,
					error: validationErrors?.modelId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							modelId: undefined,
						}),
				},
			},
			{
				header: 'Propriétaire',
				id: 'agentId',
				accessorFn: (row) =>
					formattedAgents?.find((agent) => agent.id === row.agentId)
						?.infos,
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: formattedAgents?.map((agent) => agent.infos),
					allowDeselect: true,
					clearable: true,
					error: validationErrors?.agentId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							agentId: undefined,
						}),
				},
				Cell: ({ row }) => {
					const currentAgent = formattedAgents?.find(
						(agent) => agent.id === row.original.agentId
					);
					return (
						<span className={currentAgent?.vip ? 'vip-text' : ''}>
							{currentAgent?.infos}
						</span>
					);
				},
			},
			{
				header: 'Préparation',
				accessorKey: 'preparationDate',
				size: 90,
				mantineEditTextInputProps: {
					error: validationErrors?.preparationDate,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							preparationDate: undefined,
						}),
				},
				Cell: ({ row }) => {
					if (row.original.preparationDate)
						return dateFrFormatting(row.original.preparationDate);
				},
				Edit: ({ row }) => (
					<DateChoice
						defaultValue={row.original.preparationDate}
						dateRef={preparationDateRef}
					/>
				),
			},
			{
				header: 'Attribution',
				accessorKey: 'attributionDate',
				size: 90,
				mantineEditTextInputProps: {
					error: validationErrors?.attributionDate,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							attributionDate: undefined,
						}),
				},
				Cell: ({ row }) => {
					if (row.original.attributionDate)
						return dateFrFormatting(row.original.attributionDate);
				},
				Edit: ({ row }) => (
					<DateChoice
						defaultValue={row.original.attributionDate}
						dateRef={attributionDateRef}
					/>
				),
			},
			{
				header: 'Commentaires',
				accessorKey: 'comments',
				size: 100,
				mantineEditTextInputProps: {
					error: validationErrors?.comments,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							comments: undefined,
						}),
				},
			},
		],
		[validationErrors, formattedModels, formattedAgents, models]
	);

	//CREATE action
	const handleCreateDevice: MRT_TableOptions<DeviceType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { imei, status, comments, modelId, agentId } = values;

			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				imei,
				status,
				isNew: isNewRef.current,
				preparationDate: preparationDateRef.current,
				attributionDate: preparationDateRef.current,
				comments,
				modelId: formattedModels?.find(
					(model) => model.infos === modelId
				)?.id,
				agentId: agentId
					? formattedAgents?.find((agent) => agent.infos === agentId)
							?.id
					: null,
			} as DeviceCreationType;

			const validation = deviceCreationSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si l'appareil existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some((row) => row.original.imei === data.imei.trim())
			) {
				toast.error('Un appareil avec cet IMEI existe déjà');
				return setValidationErrors({
					imei: ' ',
				});
			}

			setValidationErrors({});
			createDevice(data);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveDevice: MRT_TableOptions<DeviceType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const { imei, status, comments, modelId, agentId } = values;

			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				id: row.original.id,
				imei,
				status,
				isNew: isNewRef.current,
				preparationDate: preparationDateRef.current,
				attributionDate: attributionDateRef.current,
				comments,
				modelId: formattedModels?.find(
					(model) => model.infos === modelId
				)!.id,
				agentId: agentId
					? formattedAgents?.find((agent) => agent.infos === agentId)
							?.id
					: null,
			} as DeviceUpdateType;

			// Validation du format des données via un schéma Zod
			const validation = deviceUpdateSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si l'appareil existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) => row.original.imei === data.imei.trim()
					) &&
				row.original.id !== data.id
			) {
				toast.error('Un appareil avec cet IMEI existe déjà');
				return setValidationErrors({
					imei: ' ',
				});
			}

			const lineUsingDevice =
				lines?.find((line) => line.deviceId === data.id) || null;
			const lineOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === lineUsingDevice?.agentId
				)?.infos || null;

			// Si le propriétaire a changé et qu'une ligne utilise l'appareil,
			// le cache des lignes est mis à jour
			if (row.original.agentId !== data.agentId && lineUsingDevice) {
				displayDeviceOwnerChangeModal({
					updateDevice,
					setValidationErrors,
					closeEditing: () => table.setEditingRow(null),
					data,
					lineUsingDevice: lineUsingDevice.number,
					lineOwnerFullName,
					imei,
				});
			} else {
				updateDevice({ data });
				setValidationErrors({});
				table.setEditingRow(null);
			}
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<DeviceType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un device",
			children: (
				<Text>
					Voulez-vous vraiment supprimer l'appareil{' '}
					<span className='bold-text'>{row.original.id}</span> ? Cette
					action est irréversible.
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteDevice({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: devices || [],
		enablePagination: false,
		enableRowVirtualization: true,
		enableGlobalFilter: true,
		enableColumnFilters: false,
		enableColumnOrdering: true,
		enableColumnActions: false,
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		enableHiding: false,
		sortDescFirst: true,
		enableSortingRemoval: false,
		enableDensityToggle: false,
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateDevice,
		onEditingRowSave: handleSaveDevice,
		onEditingRowCancel: () => setValidationErrors({}),
		mantineTableContainerProps: { style: { maxHeight: '600px' } },
		renderRowActions: ({ row, table }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
			/>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
		),
		renderBottomToolbarCustomActions: () => (
			<Flex justify='end' flex={1}>
				<ExportToCsvButton request={exportsDevicesToCsv} />
			</Flex>
		),
		mantineTableProps: {
			striped: true,
		},
		mantineTopToolbarProps: {
			mt: 'xs',
			mr: 'xs',
		},
		mantineBottomToolbarProps: {
			mt: 'xs',
			mb: 'xs',
		},
		initialState: {
			density: 'xs',
			columnVisibility: {
				id: false,
			},
		},
	});

	return (
		<div className='devices-table'>
			<h2>Liste des appareils</h2>

			{anyLoading && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{anyError && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}

			{allData && <MantineReactTable table={table} />}
		</div>
	);
}
