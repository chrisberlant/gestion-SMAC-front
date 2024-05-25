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
	IconDeviceMobileOff,
	IconDeviceMobileCheck,
	IconDeviceMobileDown,
	IconDeviceMobileQuestion,
	IconDeviceMobileShare,
	IconDeviceMobileRotated,
	IconDeviceMobileCancel,
} from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

export default function Devices() {
	const {
		data: devices,
		isLoading: devicesLoading,
		isError: devicesError,
	} = useGetAllDevices();
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

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	// Ref permettant de récupérer les valeurs des composants date et switch
	const preparationDateRef = useRef<string | null>(null);
	const attributionDateRef = useRef<string | null>(null);
	const isNewRef = useRef<boolean>(true);

	const [filterParams, setFilterParams] = useSearchParams({ filter: '' });

	// Uniquement certains appareils sont affichés si un filtre est défini par l'utilisateur
	const filteredDevices = useMemo(() => {
		let filterName = '';
		switch (filterParams.get('filter')) {
			case 'in-stock':
				filterName = 'En stock';
				break;
			case 'attributed':
				filterName = 'Attribué';
				break;
			case 'restituted':
				filterName = 'Restitué';
				break;
			case 'awaiting-restitution':
				filterName = 'En attente de restitution';
				break;
			case 'lent':
				filterName = 'En prêt';
				break;
			case 'stolen':
				filterName = 'Volé';
				break;
			case 'out-of-order':
				filterName = 'En panne';
				break;
			default:
				filterName = '';
		}
		return filterName
			? devices?.filter((device) => device.status === filterName)
			: devices;
	}, [devices, filterParams]);

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

	// Agents proposés dans la liste déroulante
	const agentsList = useMemo(
		() =>
			formattedAgents?.map((agent) => ({
				value: agent.id.toString(),
				label: agent.infos,
			})),
		[formattedAgents]
	);

	// Modèles proposés dans la liste déroulante
	const modelsList = useMemo(
		() =>
			models?.map((model) => ({
				value: model.id.toString(),
				label: `${model.brand} ${model.reference}${
					model.storage ? ` ${model.storage}` : ''
				}`,
			})),
		[models]
	);
	const requiredData = devices && agents && models;

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
				maxSize: 100,
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
				maxSize: 100,
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
					maxDropdownHeight: 250,
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
				maxSize: 50,
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
				accessorFn: (row) => row.modelId?.toString(),
				editVariant: 'select',
				size: 120,
				mantineEditSelectProps: {
					data: modelsList,
					style: {
						width: 250,
					},
					allowDeselect: false,
					error: validationErrors?.modelId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							modelId: undefined,
						}),
				},
				Cell: ({ row }) => (
					<>
						{
							modelsList?.find(
								(model) =>
									Number(model.value) === row.original.modelId
							)?.label
						}
					</>
				),
			},
			{
				header: 'Propriétaire',
				id: 'agentId',
				accessorFn: (row) => row.agentId?.toString(),
				editVariant: 'select',
				size: 120,
				clearable: true,
				mantineEditSelectProps: {
					data: agentsList,
					style: {
						width: 250,
					},
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
				size: 80,
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
				size: 80,
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
					style: {
						width: 400,
					},
					error: validationErrors?.comments,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							comments: undefined,
						}),
				},
			},
		],
		[validationErrors, modelsList, formattedAgents, agentsList]
	);

	//CREATE action
	const handleCreateDevice: MRT_TableOptions<DeviceType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { imei, status, comments, modelId, agentId } = values;

			// Formatage des informations nécessaires pour la validation du schéma
			const creationData = {
				imei: imei?.trim(),
				status,
				isNew: isNewRef.current,
				preparationDate: preparationDateRef.current,
				attributionDate: preparationDateRef.current,
				comments: comments?.trim(),
				modelId: Number(modelId) || null,
				agentId: Number(agentId) || null,
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
				modelId: Number(modelId),
				agentId: Number(agentId) || null,
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
		mantineTableContainerProps: { style: { maxHeight: '60vh' } },
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
				{/* Filtres */}
				<Flex mr='auto' ml='xl'>
					<Button
						mr='xl'
						radius='lg'
						color='blue'
						variant='light'
						onClick={() => {
							filterParams.delete('filter');
							setFilterParams(filterParams);
						}}
						aria-label='Afficher tous les appareils'
						leftSection={<IconLineDashed size={20} />}
					>
						Tous les appareils
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='green'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'in-stock');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils en stock'
						leftSection={<IconDeviceMobileRotated size={20} />}
					>
						Stock
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='green'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'attributed');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils attribués'
						leftSection={<IconDeviceMobileCheck size={20} />}
					>
						Attribués
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='green'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'restituted');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils restitués'
						leftSection={<IconDeviceMobileDown size={20} />}
					>
						Restitués
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='orange'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'awaiting-restitution');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils en attente de restitution'
						leftSection={<IconDeviceMobileQuestion size={20} />}
					>
						Attente restitution
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='orange'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'lent');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils en prêt'
						leftSection={<IconDeviceMobileShare size={20} />}
					>
						Prêts
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='red'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'stolen');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils volés'
						leftSection={<IconDeviceMobileOff size={20} />}
					>
						Volés
					</Button>
					<Button
						mr='xl'
						radius='lg'
						color='red'
						variant='light'
						onClick={() =>
							setFilterParams(
								(prev) => {
									prev.set('filter', 'out-of-order');
									return prev;
								},
								{ replace: true }
							)
						}
						aria-label='Afficher les appareils en panne'
						leftSection={<IconDeviceMobileCancel size={20} />}
					>
						HS
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
		<div>
			<h2>Liste des appareils</h2>

			{anyLoading && <Loading />}

			{anyError && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}

			{requiredData && <MantineReactTable table={table} />}
		</div>
	);
}
