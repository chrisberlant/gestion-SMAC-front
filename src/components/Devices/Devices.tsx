import { ActionIcon, Button, Flex, Loader, Tooltip, Text } from '@mantine/core';
import { DatePicker, DatePickerInput, DateValue } from '@mantine/dates';
import { modals } from '@mantine/modals';
import {
	IconEdit,
	IconEditOff,
	IconTrash,
	IconTrashOff,
} from '@tabler/icons-react';
import 'dayjs/locale/fr';
import {
	MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import { useEffect, useMemo, useState } from 'react';
import { DeviceCreationType, DeviceType } from '../../types/device';
import { useGetAllAgents } from '../../utils/agentQueries';
import {
	useCreateDevice,
	useDeleteDevice,
	useGetAllDevices,
	useUpdateDevice,
} from '../../utils/deviceQueries';
import { useGetAllModels } from '../../utils/modelQueries';
import { useGetAllServices } from '../../utils/serviceQueries';
import {
	deviceCreationSchema,
	deviceUpdateSchema,
} from '../../validationSchemas/deviceSchemas';
import '@mantine/dates/styles.css';
import { useGetCurrentUser } from '../../utils/userQueries';
import { dateFormatting } from '../../utils/functions';
import SwitchButton from '../SwitchButton/SwitchButton';

function DevicesTable() {
	const { data: currentUser } = useGetCurrentUser();
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
	const { mutate: updateDevice } = useUpdateDevice();
	const { mutate: createDevice } = useCreateDevice();
	const { mutate: deleteDevice } = useDeleteDevice();

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const [value, setValue] = useState<DateValue | null>(null);
	const [isNewState, setIsNewState] = useState(false);

	// Modal calendar
	const openCalendar = (date: DateValue) =>
		modals.open({
			title: 'Sélectionner une date',
			children: (
				<DatePicker
					locale='fr'
					value={date}
					onChange={(e) => {
						date = e;
						console.log(date);
						setValue(date);
					}}
				/>
			),
			centered: true,
			size: 'sm',
			overlayProps: {
				blur: 3,
			},
		});

	useEffect(() => {}, [value]);

	// Récupération des informations des agents formatées sous forme d'un objet contenant leurs infos importantes ainsi que leurs id
	const formattedAgents = useMemo(
		() =>
			agents?.map((agent) => {
				const serviceTitle = services?.find(
					(service) => service.id === agent.serviceId
				)?.title;

				return {
					infos: `${agent.lastName} ${agent.firstName} - ${serviceTitle}`,
					id: agent.id,
				};
			}),
		[agents, services]
	);

	// La même chose pour les modèles
	const formattedModels = useMemo(
		() =>
			models?.map((model) => {
				return {
					infos: `${model.brand} ${model.reference}${
						model.storage ? ` ${model.storage}` : ''
					}`,
					id: model.id,
				};
			}),
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
				// enableClickToCopy: true,
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
			},
			{
				header: 'Statut',
				id: 'status',
				accessorFn: (row) => (!row.status ? 'En stock' : row.status),
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
				id: 'isNew',
				accessorFn: (row) =>
					row.isNew === false ? 'Occasion' : 'Neuf',
				size: 100,
				mantineEditTextInputProps: {
					error: validationErrors?.isNew,
					searchable: false,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							isNew: undefined,
						}),
				},
				Edit: ({ row }) => {
					return (
						<SwitchButton
							size='lg'
							defaultValue={row.original.isNew}
							setStateValue={setIsNewState}
							onLabel='Neuf'
							offLabel='Occasion'
						/>
					);
				},
			},
			{
				header: 'Date de préparation',
				id: 'preparationDate',
				accessorFn: (row) => {
					if (row.preparationDate)
						return dateFormatting(row.preparationDate);
				},
				size: 100,
				Edit: ({ row }) => (
					<DatePickerInput
						placeholder='Pick date'
						locale='fr'
						valueFormat='DD/MM/YYYY'
						value={new Date(row.original.preparationDate)}
						onChange={(e) => console.log(e)}
					/>
				),
				mantineEditTextInputProps: {
					error: validationErrors?.preparationDate,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							preparationDate: undefined,
						}),
				},
			},
			{
				header: "Date d'attribution",
				id: 'attributionDate',
				accessorFn: (row) => {
					if (row.attributionDate)
						return dateFormatting(row.attributionDate);
					else return '';
				},
				size: 100,
				mantineEditTextInputProps: {
					error: validationErrors?.attributionDate,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							attributionDate: undefined,
						}),
				},
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
				accessorFn: (row) => {
					return formattedAgents?.find(
						(agent) => agent.id === row.agentId
					)?.infos;
				},
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: formattedAgents?.map((agent) => agent.infos),
					clearable: true,
					error: validationErrors?.agentId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							agentId: undefined,
						}),
				},
			},
		],
		[validationErrors, formattedModels, formattedAgents, models]
	);

	//CREATE action
	const handleCreateDevice: MRT_TableOptions<DeviceType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const {
				imei,
				status,
				isNew,
				preparationDate,
				attributionDate,
				comments,
				modelId,
				agentId,
			} = values;
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				imei,
				status,
				isNew: isNew === 'Neuf' ? true : false,
				preparationDate,
				attributionDate,
				comments,
				modelId: formattedModels?.find(
					(model) => model.infos === modelId
				)?.id,
				agentId: formattedAgents?.find(
					(agent) => agent.infos === agentId
				)?.id,
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

			setValidationErrors({});
			createDevice(data);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveDevice: MRT_TableOptions<DeviceType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const {
				imei,
				status,
				preparationDate,
				attributionDate,
				comments,
				modelId,
				agentId,
			} = values;
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				id: row.original.id,
				imei,
				status,
				isNew: isNewState,
				preparationDate,
				attributionDate,
				comments,
				modelId: formattedModels!.find(
					(model) => model.infos === modelId
				)!.id,
				agentId: formattedAgents!.find(
					(agent) => agent.infos === agentId
				)?.id,
			};

			// Validation du format des données via un schéma Zod
			const validation = deviceUpdateSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			updateDevice(data);
			table.setEditingRow(null);
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
		onCreatingRowSave: handleCreateDevice,
		onEditingRowSave: handleSaveDevice,
		onEditingRowCancel: () => setValidationErrors({}),
		paginationDisplayMode: 'pages',
		renderRowActions: ({ row, table }) =>
			currentUser!.role !== 'Consultant' ? (
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
			) : (
				<Flex gap='md'>
					<Tooltip label='Non autorisé'>
						<ActionIcon
							style={{
								cursor: 'not-allowed',
								pointerEvents: 'none',
							}}
							color='#B2B2B2'
							size='sm'
						>
							<IconEditOff />
						</ActionIcon>
					</Tooltip>
					<Tooltip label='Non autorisé'>
						<ActionIcon
							style={{
								cursor: 'not-allowed',
								pointerEvents: 'none',
							}}
							color='#B2B2B2'
							size='sm'
						>
							<IconTrashOff />
						</ActionIcon>
					</Tooltip>
				</Flex>
			),
		renderTopToolbarCustomActions: ({ table }) =>
			currentUser!.role !== 'Consultant' ? (
				<Button
					onClick={() => table.setCreatingRow(true)}
					mr='auto'
					ml='xs'
				>
					Ajouter
				</Button>
			) : (
				<Button
					mr='auto'
					ml='xs'
					style={{
						cursor: 'not-allowed',
						pointerEvents: 'none',
					}}
					color='#B2B2B2'
				>
					Ajout impossible
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
				pageSize: 50, // rows per page
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

	return (
		<div className='devices-table'>
			<h2>Liste des appareils</h2>
			{(servicesLoading ||
				devicesLoading ||
				agentsLoading ||
				modelsLoading) && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}
			{(servicesError || devicesError || agentsError || modelsError) && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}
			{devices && services && agents && models && (
				<MantineReactTable table={table} />
			)}
		</div>
	);
}

export default DevicesTable;
