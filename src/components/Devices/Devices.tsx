import { Button, Flex } from '@mantine/core';
import 'dayjs/locale/fr';
import {
	MRT_ColumnDef,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import { useMemo, useRef, useState } from 'react';
import {
	DeviceCreationType,
	DeviceType,
	DeviceUpdateType,
} from '@customTypes/device';
import { useGetAllAgents } from '@queries/agentQueries';
import {
	useCreateDevice,
	useDeleteDevice,
	useExportDevicesToCsv,
	useGetAllDevices,
	useUpdateDevice,
} from '@queries/deviceQueries';
import { useGetAllModels } from '@queries/modelQueries';
import { useGetAllServices } from '@queries/serviceQueries';
import { useGetAllLines } from '@queries/lineQueries';
import {
	deviceCreationSchema,
	deviceUpdateSchema,
} from '@validationSchemas/deviceSchemas';
import '@mantine/dates/styles.css';
import { dateFrFormatting, getModifiedValues } from '@utils/index';
import SwitchButton from '../SwitchButton/SwitchButton';
import DateChoice from '../DateChoice/DateChoice';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import displayDeviceOwnerChangeModal from '@modals/deviceOwnerChangeModal';
import displayDeviceDeleteModal from '@modals/deviceDeleteModal';
import CsvExportButton from '../CsvExportButton/CsvExportButton';
import { toast } from 'sonner';
import CsvImportButton from '../CsvImportButton/CsvImportButton';
import Loading from '../Loading/Loading';
import { virtualizedTableConfig } from '@utils/tableConfig';
import {
	IconLineDashed,
	IconAntennaBarsOff,
	IconDeviceMobileOff,
	IconDeviceMobile,
	IconDeviceMobileCheck,
	IconDeviceMobileDown,
	IconDeviceMobileQuestion,
	IconDeviceMobileShare,
	IconDeviceMobileRotated,
} from '@tabler/icons-react';

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

	// Ref permettant de récupérer les valeurs des composants date et switch
	const preparationDateRef = useRef<string | null>(null);
	const attributionDateRef = useRef<string | null>(null);
	const isNewRef = useRef<boolean>(true);

	const [filter, setFilter] = useState<
		| 'En stock'
		| 'Attribué'
		| 'Restitué'
		| 'En attente de restitution'
		| 'En prêt'
		| 'Volé'
		| null
	>(null);
	// Uniquement certains appareils sont affichés si un filtre est défini par l'utilisateur
	const filteredDevices = useMemo(() => {
		if (!filter) return devices;
		return devices?.filter((device) => device.status === filter);
	}, [devices, filter]);

	// Récupération des informations des agents formatées sous forme d'un objet contenant leurs infos importantes ainsi que leurs id
	const formattedAgents = useMemo(
		() =>
			agents?.map((agent) => {
				const serviceTitle = services?.find(
					(service) => service.id === agent?.serviceId
				)?.title;

				return {
					infos: `${agent?.lastName} ${agent?.firstName} - ${serviceTitle}`,
					vip: agent?.vip,
					email: agent?.email,
					id: agent?.id,
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
				enableHiding: false,
			},
			{
				header: 'IMEI',
				accessorKey: 'imei',
				size: 150,
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
					maxDropdownHeight: 234,
					searchable: false,
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
				Cell: ({ cell }) => (
					<span>{cell.getValue() ? 'Neuf' : 'Occasion'}</span>
				),
				Edit: ({ cell, row }) => (
					// Bouton sur "Neuf" par défaut lors de la création (donc imei vide)
					<SwitchButton
						size='lg'
						defaultValue={
							!row.original.imei || cell.getValue() ? true : false
						}
						valueRef={isNewRef}
						onLabel='Neuf'
						offLabel='Occasion'
					/>
				),
			},
			{
				header: 'Modèle',
				id: 'modelId',
				accessorFn: (row) =>
					formattedModels?.find((model) => model.id === row.modelId)
						?.infos,
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
				clearable: true,
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
				Cell: ({ row }) =>
					dateFrFormatting(row.original.preparationDate),
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
				Cell: ({ row }) =>
					dateFrFormatting(row.original.attributionDate) || null,
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
		[validationErrors, formattedModels, formattedAgents]
	);

	//CREATE action
	const handleCreateDevice: MRT_TableOptions<DeviceType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { imei, status, comments, modelId, agentId } = values;

			// Formatage des informations nécessaires pour la validation du schéma
			const creationData = {
				imei: imei.trim(),
				status,
				isNew: isNewRef.current,
				preparationDate: preparationDateRef.current,
				attributionDate: preparationDateRef.current,
				comments: comments?.trim(),
				modelId: formattedModels?.find(
					(model) => model.infos === modelId
				)?.id,
				agentId: agentId
					? formattedAgents?.find((agent) => agent.infos === agentId)
							?.id
					: null,
			} as DeviceCreationType;

			const validation = deviceCreationSchema.safeParse(creationData);
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
					.rows.some((row) => row.original.imei === creationData.imei)
			) {
				toast.error('Un appareil avec cet IMEI existe déjà');
				return setValidationErrors({
					imei: ' ',
				});
			}

			setValidationErrors({});
			createDevice(creationData);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveDevice: MRT_TableOptions<DeviceType>['onEditingRowSave'] =
		async ({ values, row, table }) => {
			const { imei, status, comments, modelId, agentId } = values;
			const { ...originalData } = row.original;

			// Formatage des données
			const updateData = {
				id: originalData.id,
				imei: imei.trim(),
				status,
				isNew: isNewRef.current,
				preparationDate: preparationDateRef.current,
				attributionDate: attributionDateRef.current,
				comments: comments?.trim(),
				modelId: formattedModels?.find(
					(model) => model.infos === modelId
				)!.id,
				agentId: agentId
					? formattedAgents?.find((agent) => agent.infos === agentId)
							?.id
					: null,
			} as DeviceType;

			// Optimisation pour envoyer uniquement les données modifiées
			const newModifiedData = getModifiedValues(
				originalData,
				updateData
			) as DeviceUpdateType;

			// Si aucune modification des données
			if (Object.keys(newModifiedData).length < 2) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Validation du format des données via un schéma Zod
			const validation = deviceUpdateSchema.safeParse(newModifiedData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si un IMEI est fourni, vérification s'il n'est pas déjà utilisé
			if (newModifiedData.imei) {
				if (
					table
						.getCoreRowModel()
						.rows.some(
							(row) =>
								row.original.imei === updateData.imei &&
								row.original.id !== updateData.id
						)
				) {
					toast.error('Un appareil avec cet IMEI existe déjà');
					return setValidationErrors({
						imei: ' ',
					});
				}
			}

			const lineUsingDevice =
				lines?.find((line) => line.deviceId === newModifiedData.id) ||
				null;
			const lineOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === lineUsingDevice?.agentId
				)?.infos || null;

			// Si le propriétaire a changé et qu'une ligne utilise l'appareil,
			// le cache des lignes est mis à jour
			if (newModifiedData.agentId && lineUsingDevice) {
				return displayDeviceOwnerChangeModal({
					updateDevice,
					setValidationErrors,
					closeEditing: () => table.setEditingRow(null),
					data: newModifiedData,
					lineUsingDevice: lineUsingDevice.number,
					lineOwnerFullName,
					imei,
				});
			}

			updateDevice(newModifiedData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

	const table = useMantineReactTable({
		...virtualizedTableConfig,
		initialState: {
			density: 'xs',
			columnVisibility: {
				id: false,
			},
		},
		columns,
		data: filteredDevices || [],
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateDevice,
		onEditingRowSave: handleSaveDevice,
		onEditingRowCancel: () => setValidationErrors({}),
		renderRowActions: ({ row }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => {
					// Vérification si l'appareil est associé à une ligne
					const affectedLineNumber =
						lines?.find((line) => line.deviceId === row.original.id)
							?.number || null;
					displayDeviceDeleteModal({
						deviceId: row.original.id,
						imei: row.original.imei,
						affectedLineNumber,
						deleteDevice,
					});
				}}
			/>
		),
		renderTopToolbarCustomActions: () => (
			<>
				<CreateButton
					createFunction={() => table.setCreatingRow(true)}
				/>
				<Flex mr='auto' ml='xl'>
					<Button
						mr='xl'
						radius='lg'
						color='blue'
						onClick={() => setFilter(null)}
						aria-label='Afficher tous les appareils'
						leftSection={<IconLineDashed />}
					>
						Tous les appareils
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='green'
						onClick={() => setFilter('En stock')}
						aria-label='Afficher les appareils en stock'
						leftSection={<IconDeviceMobileRotated />}
					>
						En stock
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='green'
						onClick={() => setFilter('Attribué')}
						aria-label='Afficher les appareils attribués'
						leftSection={<IconDeviceMobileCheck />}
					>
						Attribués
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='green'
						onClick={() => setFilter('Restitué')}
						aria-label='Afficher les appareils restitués'
						leftSection={<IconDeviceMobileDown />}
					>
						Restitués
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='orange'
						onClick={() => setFilter('En attente de restitution')}
						aria-label='Afficher les appareils en attente de restitution'
						leftSection={<IconDeviceMobileQuestion />}
					>
						En attente de restitution
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='orange'
						onClick={() => setFilter('En prêt')}
						aria-label='Afficher les appareils en prêt'
						leftSection={<IconDeviceMobileShare />}
					>
						En prêt
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='red'
						onClick={() => setFilter('Volé')}
						aria-label='Afficher les appareils volés'
						leftSection={<IconDeviceMobileOff />}
					>
						Volés
					</Button>
				</Flex>
				<CsvImportButton model='devices' />
			</>
		),
		renderBottomToolbarCustomActions: () => (
			<Flex justify='end' flex={1}>
				<CsvExportButton request={exportsDevicesToCsv} />
			</Flex>
		),
	});

	return (
		<div className='devices-table'>
			<h2>Liste des appareils</h2>

			{anyLoading && <Loading />}

			{anyError && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}

			{allData && <MantineReactTable table={table} />}
		</div>
	);
}
