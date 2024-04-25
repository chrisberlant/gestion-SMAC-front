/* eslint-disable no-mixed-spaces-and-tabs */
import { Flex } from '@mantine/core';
import {
	lineCreationSchema,
	lineUpdateSchema,
} from '@validationSchemas/lineSchemas';
import {
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_TableInstance,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { LineCreationType, LineType, LineUpdateType } from '@customTypes/line';
import {
	useCreateLine,
	useDeleteLine,
	useExportLinesToCsv,
	useGetAllLines,
	useUpdateLine,
} from '@queries/lineQueries';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';
import { useGetAllAgents } from '@queries/agentQueries';
import { useGetAllServices } from '@queries/serviceQueries';
import { useGetAllDevices } from '@queries/deviceQueries';
import { useGetAllModels } from '@queries/modelQueries';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import displayLineCreationModal from '@modals/lineCreationModals';
import displayLineUpdateModal from '@modals/lineUpdateModals';
import displayLineDeleteModal from '@modals/lineDeleteModal';
import CsvExportButton from '../CsvExportButton/CsvExportButton';
import { toast } from 'sonner';
import CsvImportButton from '../CsvImportButton/CsvImportButton';
import { getModifiedValues } from '@utils/index';
import { virtualizedTableConfig } from '@utils/tableConfig';
import Loading from '../Loading/Loading';
import AgentQuickAddButton from '../TableActionsButtons/AgentQuickAddButton/AgentQuickAddButton';
import DeviceQuickAddButton from '../TableActionsButtons/DeviceQuickAddButton/DeviceQuickAddButton';

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
	const allData = services && agents && devices && models && lines;
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	// const [filter, setFilter] = useState<
	// 	'active' | 'inProgress' | 'resiliated' | null
	// >(null);

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

	// La même chose pour les appareils
	const formattedDevices = useMemo(
		() =>
			devices?.map((device) => {
				const currentModel = models?.find(
					(model) => model.id === device.modelId
				);
				return {
					infos: `${device.imei} - ${currentModel?.brand} ${
						currentModel?.reference
					}${
						currentModel?.storage ? ` ${currentModel.storage}` : ''
					}`,
					id: device.id,
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
				size: 50,
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
				id: 'profile',
				accessorFn: (row) => row.profile || 'VD',
				editVariant: 'select',
				size: 50,
				mantineEditSelectProps: {
					data: ['VD', 'V', 'D'], // Options disponibles dans le menu déroulant
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
				id: 'status',
				accessorFn: (row) => row.status || 'Active',
				editVariant: 'select',
				size: 90,
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
				header: 'Appareil',
				id: 'deviceId',
				accessorFn: (row) =>
					formattedDevices?.find(
						(device) => device.id === row.deviceId
					)?.infos,
				editVariant: 'select',
				size: 90,
				mantineEditSelectProps: {
					data: formattedDevices?.map((device) => device.infos),
					clearable: true,
					error: validationErrors?.deviceId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							status: undefined,
						}),
				},
				Cell: ({ cell }) => {
					const currentDevice = cell.getValue();
					return currentDevice ? (
						<>{currentDevice}</>
					) : (
						<span className='personal-device-text'>
							Aucun appareil (ou personnel)
						</span>
					);
				},
			},
			{
				header: 'Commentaires',
				accessorKey: 'comments',
				size: 90,
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
		[validationErrors, formattedAgents, formattedDevices]
	);

	//CREATE action
	const handleCreateLine: MRT_TableOptions<LineType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { number, profile, status, comments, agentId, deviceId } =
				values;

			// Formatage des informations nécessaires pour la validation du schéma et envoi à l'API
			const creationData = {
				number: number.trim(),
				profile,
				status,
				comments: comments?.trim(),
				agentId: agentId
					? formattedAgents?.find((agent) => agent.infos === agentId)
							?.id
					: null,
				deviceId: deviceId
					? formattedDevices?.find(
							(device) => device.infos === deviceId
					  )?.id
					: null,
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
			// TODO simplifier
			// Si un appareil a été défini lors de la création, des vérifications sont à effectuer
			// Vérification de la présence de l'appareil dans les autres lignes et de son propriétaire actuel
			const newOwnerId = creationData.agentId ?? null;
			const newOwnerFullName: string | null = agentId ?? null;
			const newDeviceId = creationData.deviceId ?? null;
			const deviceFullName: string | null = deviceId;
			const alreadyUsingDeviceLine =
				lines?.find((line) => line.deviceId === newDeviceId) || null;
			const currentOwnerId =
				devices?.find((device) => device.id === newDeviceId)?.agentId ||
				null;
			const currentOwnerFullName =
				formattedAgents?.find((agent) => agent.id === currentOwnerId)
					?.infos || null;

			// Si aucun appareil ou si l'appareil appartient déjà à l'agent ou qu'aucun nouveau et ancien propriétaires ne sont définis
			// et qu'il n'est affecté à aucune autre ligne, aucune modale
			!newDeviceId ||
			(newOwnerId === currentOwnerId && !alreadyUsingDeviceLine)
				? (createLine(creationData),
				  setValidationErrors({}),
				  exitCreatingMode())
				: displayLineCreationModal({
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
				number: number.trim(),
				profile,
				status,
				comments: comments?.trim(),
				agentId:
					formattedAgents?.find((agent) => agent.infos === agentId)
						?.id || null,
				deviceId:
					formattedDevices?.find(
						(device) => device.infos === deviceId
					)?.id || null,
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
			const newLineOwnerFullName: string | null = agentId ?? null;
			const newDeviceId = updateData.deviceId ?? null;
			const newDevice = newDeviceId
				? devices?.find((device) => device.id === newDeviceId)
				: null;
			const deviceCurrentOwnerId = newDevice ? newDevice.agentId : null;
			const deviceCurrentOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === deviceCurrentOwnerId
				)?.infos ?? null;
			const currentDeviceId = originalData.deviceId || null;
			const deviceFullName: string | null = deviceId ?? null;
			const alreadyUsingDeviceLine =
				lines?.find(
					(line) =>
						line.deviceId === newDeviceId &&
						line.id !== row.original.id
				) || null;
			const alreadyUsingDeviceLineOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === alreadyUsingDeviceLine?.agentId
				)?.infos || null;

			// Si aucun nouvel appareil
			// ou si l'appareil et le propriétaire n'ont pas été modifiés
			// ou si l'appareil et l'agent fournis sont déjà liés et l'appareil non affecté à une autre ligne, pas de modale
			if (
				!newDeviceId ||
				(currentDeviceId === newDeviceId &&
					currentLineOwnerId === newLineOwnerId) ||
				(!alreadyUsingDeviceLine &&
					deviceCurrentOwnerId === newLineOwnerId)
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
				deviceCurrentOwnerId,
				deviceCurrentOwnerFullName,
				newDeviceId,
				updateData: newModifiedData,
			});
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<LineType>) => {
		const currentOwnerFullName =
			formattedAgents?.find((agent) => agent.id === row.original.agentId)
				?.infos || null;
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
		data: lines || [],
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
		// TODO fix
		renderTopToolbarCustomActions: () => (
			<>
				<CreateButton
					createFunction={() => table.setCreatingRow(true)}
				/>
				<AgentQuickAddButton services={services} />
				<DeviceQuickAddButton models={models} agents={agents} />
				<CsvImportButton model='lines' />
				{/* <Flex gap='xl' justify='center' align='center' flex={1} mb='xs'>
					<Button color='green' onClick={() => console.log(null)}>
						Toutes les lignes
					</Button>
					<Button color='green' onClick={() => console.log('active')}>
						Actives
					</Button>
					<Button
						color='orange'
						onClick={() => console.log('inProgress')}
					>
						En cours
					</Button>
					<Button
						color='red'
						onClick={() => console.log('resiliated')}
					>
						Résiliées
					</Button>
				</Flex> */}
			</>
		),
		renderBottomToolbarCustomActions: () => (
			<Flex justify='end' flex={1}>
				<CsvExportButton request={exportsLinesToCsv} />
			</Flex>
		),
	});

	return (
		<ZoomableComponent>
			<h2>Liste des lignes</h2>

			{anyLoading && <Loading />}

			{anyError && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}

			{allData && <MantineReactTable table={table} />}
		</ZoomableComponent>
	);
}
