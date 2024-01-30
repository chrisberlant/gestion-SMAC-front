import { ActionIcon, Button, Flex, Loader, Tooltip } from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import 'dayjs/locale/fr';
import {
	MRT_ColumnDef,
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { DeviceType } from '../../types';
import { useGetAllAgents } from '../../utils/agentQueries';
import {
	useCreateDevice,
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

function DevicesTable() {
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

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	// Modal calendar
	// const openCalendar = (date: any) =>
	// 	modals.open({
	// 		title: 'Sélectionner une date',
	// 		children: (
	// 			<DatePicker
	// 				locale='fr'
	// 				value={date}
	// 				onChange={(e) => {
	// 					date = e;
	// 					console.log(date);
	// 				}}
	// 			/>
	// 		),
	// 		centered: true,
	// 		size: 'sm',
	// 		overlayProps: {
	// 			blur: 3,
	// 		},
	// 	});

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
				searchable: false,
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
				accessorKey: 'status',
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
				accessorFn: (row) => (row.isNew ? 'Neuf' : 'Occasion'),
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: ['Neuf', 'Occasion'],
					error: validationErrors?.isNew,
					searchable: false,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							isNew: undefined,
						}),
				},
			},
			{
				header: 'Date de préparation',
				accessorKey: 'preparationDate',
				size: 100,
				mantineEditTextInputProps: ({ row }) => ({
					error: validationErrors?.preparationDate,
					onFocus: () => {
						setValidationErrors({
							...validationErrors,
							preparationDate: undefined,
						});
					},
					// TODO fix
					onClick: () => {
						return (
							<DatePickerInput
								placeholder={row.original.preparationDate}
								// value={value}
								// onChange={setValue}
							/>
						);
					},
				}),
			},
			{
				header: "Date d'attribution",
				accessorKey: 'attributionDate',
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
					return `${currentModel?.brand} ${currentModel?.reference} ${currentModel?.storage}`;
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
					error: validationErrors?.agentId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							agentId: undefined,
						}),
				},
			},
		],
		[formattedAgents, models, validationErrors, formattedModels]
	);

	//CREATE action
	const handleCreateDevice: MRT_TableOptions<DeviceType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const validation = deviceCreationSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			createDevice(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveDevice: MRT_TableOptions<DeviceType>['onEditingRowSave'] =
		async ({ values, row }) => {
			console.log(values.imei);
			console.log(values);
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				...values,
				id: row.original.id,
				agentId: formattedAgents!.find(
					(agent) => agent.infos === values.agentId
				)?.id,
				modelId: formattedModels!.find(
					(model) => model.infos === values.modelId
				)!.id,
				isNew: values.isNew === 'Neuf' ? true : false,
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
