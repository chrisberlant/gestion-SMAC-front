import { Flex } from '@mantine/core';
import {
	lineCreationSchema,
	lineUpdateSchema,
} from '@/validationSchemas/lineSchemas';
import {
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_TableInstance,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { LineCreationType, LineType, LineUpdateType } from '@/types/line';
import {
	useCreateLine,
	useDeleteLine,
	useExportLinesToCsv,
	useGetAllLines,
	useUpdateLine,
} from '@/hooks/lineQueries';
import { useGetAllAgents } from '@/hooks/agentQueries';
import { useGetAllServices } from '@/hooks/serviceQueries';
import { useGetAllDevices } from '@/hooks/deviceQueries';
import { useGetAllModels } from '@/hooks/modelQueries';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import displayLineCreationModal from '@/modals/lineCreationModals';
import displayLineUpdateModal from '@/modals/lineUpdateModals';
import displayLineDeleteModal from '@/modals/lineDeleteModal';
import CsvExportButton from '../CsvExportButton/CsvExportButton';
import { toast } from 'sonner';
import CsvImportButton from '../CsvImportButton/CsvImportButton';
import { getModifiedValues } from '@/utils';
import { virtualizedTableConfig } from '@/utils/tableConfig';
import Loading from '../Loading/Loading';
import AgentQuickAddButton from '../TableActionsButtons/AgentQuickAdd/AgentQuickAddButton';
import DeviceQuickAddButton from '../TableActionsButtons/DeviceQuickAdd/DeviceQuickAddButton';
import { useSearchParams } from 'react-router-dom';
import LinesFilter from './LinesFilter/LinesFilter';

export default function Lines() {
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

	const { mutate: createLine } = useCreateLine();
	const { mutate: updateLine } = useUpdateLine();
	const { mutate: deleteLine } = useDeleteLine();
	const { refetch: exportsLinesToCsv } = useExportLinesToCsv();

	const anyLoading =
		linesLoading ||
		servicesLoading ||
		devicesLoading ||
		agentsLoading ||
		modelsLoading;
	const anyError =
		linesError ||
		servicesError ||
		devicesError ||
		agentsError ||
		modelsError;

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const [filterParams, setFilterParams] = useSearchParams({ filter: '' });

	// Uniquement certaines lignes sont affichées si un filtre est défini par l'utilisateur
	const filteredLines = useMemo(() => {
		let filterName = '';
		switch (filterParams.get('filter')) {
			case 'active':
				filterName = 'Active';
				break;
			case 'in-progress':
				filterName = 'En cours';
				break;
			case 'resiliated':
				filterName = 'Résiliée';
				break;
			default:
				filterName = '';
		}

		return filterName
			? lines?.filter((line) => line.status === filterName)
			: lines;
	}, [lines, filterParams]);

	// Récupération des informations des agents formatées sous forme d'un tableau d'objets contenant leurs infos importantes ainsi que leurs id
	const formattedAgents = useMemo(
		() =>
			agents?.map((agent) => {
				const serviceTitle = services?.find(
					(service) => service.id === agent.serviceId
				)?.title;

				return {
					infos: `${agent.lastName} ${agent.firstName} - ${serviceTitle}`,
					vip: agent.vip,
					id: agent.id,
				};
			}) ?? [],
		[agents, services]
	);

	const formattedModels = useMemo(
		() =>
			models?.reduce<Record<number, string>>((acc, model) => {
				acc[model.id] = `${model.brand} ${model.reference}${
					model.storage ? ` ${model.storage}` : ''
				}`;
				return acc;
			}, {}) ?? {},
		[models]
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

	// Appareils proposés dans la liste déroulante
	const devicesList = useMemo(
		() =>
			devices?.map((device) => {
				const currentModel = models?.find(
					(model) => model.id === device.modelId
				);
				return {
					value: device.id.toString(),
					label: `${device.imei} - ${currentModel?.brand} ${
						currentModel?.reference
					}${
						currentModel?.storage ? ` ${currentModel.storage}` : ''
					}`,
				};
			}),
		[devices, models]
	);

	const columns = useMemo<MRT_ColumnDef<LineType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				enableEditing: false,
				enableHiding: false,
			},
			{
				header: 'Numéro',
				accessorKey: 'number',
				size: 80,
				mantineEditTextInputProps: {
					error: validationErrors?.number,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							number: undefined,
						}),
				},
				enableClickToCopy: true,
			},
			{
				header: 'Profil',
				accessorKey: 'profile',
				editVariant: 'select',
				size: 70,
				mantineEditSelectProps: {
					data: ['VD', 'V', 'D'], // Options disponibles dans le menu déroulant
					style: {
						width: 120,
					},
					allowDeselect: false,
					error: validationErrors?.profile,
					searchable: false, // Désactiver la recherche
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							profile: undefined,
						}),
				},
			},
			{
				header: 'Statut',
				accessorKey: 'status',
				editVariant: 'select',
				size: 70,
				mantineEditSelectProps: {
					data: ['Active', 'En cours', 'Résiliée'],
					allowDeselect: false,
					error: validationErrors?.status,
					searchable: false,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							status: undefined,
						}),
				},
			},
			{
				header: 'Propriétaire',
				id: 'agentId',
				accessorFn: (row) => row.agentId?.toString(),
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: agentsList,
					style: {
						width: 250,
					},
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
				header: 'Appareil',
				id: 'deviceId',
				accessorFn: (row) => row.deviceId?.toString(),
				editVariant: 'select',
				minSize: 90,
				maxSize: 110,
				mantineEditSelectProps: {
					data: devicesList,
					style: {
						width: 400,
					},
					clearable: true,
					error: validationErrors?.deviceId,
					// TODO
					onClear: () => {},
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							deviceId: undefined,
						}),
				},
				Cell: ({ cell, row }) => {
					const currentDevice = cell.getValue();
					return currentDevice ? (
						<>
							{
								devices?.find(
									(device) =>
										device.id === row.original.deviceId
								)?.imei
							}
						</>
					) : (
						<span className='personal-device-text'>
							Aucun appareil (ou personnel)
						</span>
					);
				},
			},
			{
				header: 'Modèle',
				id: 'deviceModel',
				enableEditing: false,
				accessorFn: (row) => {
					if (!row.deviceId) return '';
					const modelId = devices?.find(
						(device) => device.id === row.deviceId
					)?.modelId;
					if (!modelId) return '';
					return formattedModels[modelId] ?? '';
				},
				minSize: 90,
				maxSize: 120,
				mantineEditTextInputProps: {
					style: {
						width: 400,
					},
					error: validationErrors?.comments,
				},
			},
			{
				header: 'Commentaires',
				accessorKey: 'comments',
				minSize: 90,
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
		[validationErrors, formattedAgents, agentsList, devicesList]
	);

	// Gestion de l'ordre des colonnes
	const storedColumnOrder = localStorage.getItem('linesColumnOrder');
	const initialColumnOrder = storedColumnOrder
		? JSON.parse(storedColumnOrder)
		: [
				'mrt-row-actions',
				...columns.map(
					(c) => (c.accessorKey as string) ?? (c.id as string)
				),
		  ];
	const [columnOrder, setColumnOrder] =
		useState<string[]>(initialColumnOrder);

	//CREATE action
	const handleCreateLine: MRT_TableOptions<LineType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { number, profile, status, comments, agentId, deviceId } =
				values;

			// Formatage des informations nécessaires pour la validation du schéma et envoi à l'API
			const creationData = {
				number: number?.trim() || undefined,
				profile,
				status,
				comments: comments?.trim() || null,
				agentId: Number(agentId) || null,
				deviceId: Number(deviceId) || null,
			} as LineCreationType;

			const validation = lineCreationSchema.safeParse(creationData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si la ligne existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) => row.original.number === creationData.number
					)
			) {
				toast.error('Une ligne avec ce numéro existe déjà');
				return setValidationErrors({
					number: ' ',
				});
			}

			// Si aucun appareil fourni, pas de modale
			if (!creationData.deviceId) {
				createLine(creationData);
				setValidationErrors({});
				return exitCreatingMode();
			}

			// Si un appareil a été défini lors de la création, des vérifications sont à effectuer
			const newOwnerId = creationData.agentId ?? null;
			const newOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === creationData.agentId
				)?.infos ?? null;
			const newDeviceId = creationData.deviceId ?? null;
			const deviceFullName =
				devicesList?.find((device) => device.value === deviceId)
					?.label ?? null;
			// Vérification de la présence de l'appareil dans les autres lignes et de son propriétaire actuel
			const alreadyUsingDeviceLine =
				lines?.find((line) => line.deviceId === newDeviceId) ?? null;
			const currentOwnerId =
				devices?.find((device) => device.id === newDeviceId)?.agentId ??
				null;
			const currentOwnerFullName =
				formattedAgents?.find((agent) => agent.id === currentOwnerId)
					?.infos ?? null;

			// Si aucun appareil ou si l'appareil appartient déjà à l'agent ou qu'aucun nouveau et ancien propriétaires ne sont définis
			// et qu'il n'est affecté à aucune autre ligne, aucune modale
			if (
				!newDeviceId ||
				(newOwnerId === currentOwnerId && !alreadyUsingDeviceLine)
			) {
				createLine(creationData);
				setValidationErrors({});
				return exitCreatingMode();
			}

			return displayLineCreationModal({
				createLine,
				exitCreatingMode,
				setValidationErrors,
				alreadyUsingDeviceLine,
				deviceFullName,
				currentOwnerFullName,
				currentOwnerId,
				newOwnerFullName,
				newOwnerId,
				creationData,
			});
		};

	//UPDATE action
	const handleSaveLine: MRT_TableOptions<LineType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const { number, profile, status, comments, deviceId, agentId } =
				values;
			const { ...originalData } = row.original;

			// Formatage des informations nécessaires pour la validation du schéma
			const updateData = {
				id: originalData.id,
				number: number?.trim(),
				profile,
				status,
				comments: comments?.trim() || null,
				agentId: Number(agentId) || null,
				deviceId: Number(deviceId) || null,
			} as LineType;

			// Optimisation pour envoyer uniquement les données modifiées
			const newModifiedData = getModifiedValues(
				originalData,
				updateData
			) as LineUpdateType;

			// Si aucune modification des données
			if (Object.keys(newModifiedData).length < 2) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Validation du format des données via un schéma Zod
			const validation = lineUpdateSchema.safeParse(newModifiedData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si un numéro est fourni, vérification s'il n'est pas déjà utilisé
			if (newModifiedData.number) {
				if (
					table
						.getCoreRowModel()
						.rows.some(
							(row) =>
								row.original.number === updateData.number &&
								row.original.id !== updateData.id
						)
				) {
					toast.error('Une ligne avec ce numéro existe déjà');
					return setValidationErrors({
						number: ' ',
					});
				}
			}

			const currentLineOwnerId = originalData.agentId ?? null;
			const newLineOwnerId = updateData.agentId ?? null;
			const newLineOwnerFullName: string | null =
				formattedAgents?.find((agent) => agent.id === newLineOwnerId)
					?.infos ?? null;
			const newDeviceId = updateData.deviceId ?? null;
			const newDevice = newDeviceId
				? devices?.find((device) => device.id === newDeviceId)
				: null;
			const currentDeviceOwnerId = newDevice ? newDevice.agentId : null;
			const currentDeviceOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === currentDeviceOwnerId
				)?.infos ?? null;
			const currentDeviceId = originalData.deviceId ?? null;
			const deviceFullName: string | null =
				devicesList?.find(
					(device) => Number(device.value) === newDeviceId
				)?.label ?? null;
			const alreadyUsingDeviceLine =
				lines?.find(
					(line) =>
						line.deviceId === newDeviceId &&
						line.id !== row.original.id
				) ?? null;
			const alreadyUsingDeviceLineOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === alreadyUsingDeviceLine?.agentId
				)?.infos ?? null;

			// Si retrait de l'appareil
			// ou si l'appareil et le propriétaire n'ont pas été modifiés
			// ou si l'appareil et l'agent fournis sont déjà liés et l'appareil non affecté à une autre ligne, pas de modale
			if (
				!newDeviceId ||
				(currentDeviceId === newDeviceId &&
					currentLineOwnerId === newLineOwnerId) ||
				(!alreadyUsingDeviceLine &&
					currentDeviceOwnerId === newLineOwnerId)
			) {
				updateLine(newModifiedData);
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Sinon affichage de la modale en fonction du contexte
			displayLineUpdateModal({
				updateLine,
				exitUpdatingMode: () => table.setEditingRow(null),
				setValidationErrors,
				alreadyUsingDeviceLine,
				alreadyUsingDeviceLineOwnerFullName,
				deviceFullName,
				currentLineOwnerId,
				newLineOwnerFullName,
				newLineOwnerId,
				currentDeviceId,
				currentDeviceOwnerId,
				currentDeviceOwnerFullName,
				newDeviceId,
				updateData: newModifiedData,
			});
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<LineType>) => {
		const currentOwnerFullName =
			formattedAgents?.find((agent) => agent.id === row.original.agentId)
				?.infos ?? null;
		const lineNumber = row.original.number;
		displayLineDeleteModal({
			id: row.original.id,
			lineNumber,
			currentOwnerFullName,
			deleteLine,
		});
	};

	const table: MRT_TableInstance<LineType> = useMantineReactTable({
		...virtualizedTableConfig,
		initialState: {
			density: 'xs',
			columnVisibility: {
				id: false,
			},
		},
		columns,
		data: filteredLines ?? [],
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateLine,
		onEditingRowSave: handleSaveLine,
		onEditingRowCancel: () => setValidationErrors({}),
		renderRowActions: ({ row }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
			/>
		),
		renderTopToolbarCustomActions: () => (
			<>
				<CreateButton
					createFunction={() => table.setCreatingRow(true)}
				/>
				<LinesFilter
					filterParams={filterParams}
					setFilterParams={setFilterParams}
				/>
				<AgentQuickAddButton services={services} />
				<DeviceQuickAddButton models={models} agents={agents} />
				<CsvImportButton model='lines' />
			</>
		),
		renderBottomToolbarCustomActions: () => (
			<Flex justify='end' flex={1}>
				<CsvExportButton request={exportsLinesToCsv} />
			</Flex>
		),
		state: {
			columnOrder,
		},
		onColumnOrderChange: (newColumnOrder) => {
			localStorage.setItem(
				'linesColumnOrder',
				JSON.stringify(newColumnOrder)
			);
			setColumnOrder(newColumnOrder);
		},
	});

	return (
		<section>
			<h2>Liste des lignes</h2>

			{anyLoading && <Loading />}

			{anyError && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}

			{!anyLoading && !anyError && <MantineReactTable table={table} />}
		</section>
	);
}
