/* eslint-disable no-mixed-spaces-and-tabs */
import { Button, Flex, Loader } from '@mantine/core';
import { useGetAllServices } from '@utils/serviceQueries';
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
import { LineCreationType, LineType, LineUpdateType } from '../../types/line';
import {
	useCreateLine,
	useDeleteLine,
	useGetAllLines,
	useUpdateLine,
} from '../../utils/lineQueries';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';
import { useGetAllAgents } from '../../utils/agentQueries';
import { useGetAllDevices } from '../../utils/deviceQueries';
import { useGetAllModels } from '../../utils/modelQueries';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import displayLineCreationModal from '../../modals/lineCreationModal';
import displayLineUpdateModal from '../../modals/lineUpdateModal';
import displayLineDeleteModal from '../../modals/lineDeleteModal';

export default function ActiveLines() {
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
				mantineCopyButtonProps: {
					style: { fontSize: 14 },
				},
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
					searchable: true,
					clearable: true,
					error: validationErrors?.deviceId,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							status: undefined,
						}),
				},
				Cell: ({ row }) => {
					const currentDevice = formattedDevices?.find(
						(device) => device.id === row.original.deviceId
					)?.infos;
					return (
						currentDevice ?? (
							<span className='personal-device-text'>
								Aucun appareil (ou personnel)
							</span>
						)
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
				number,
				profile,
				status,
				comments,
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

			// Si aucun appareil fourni, pas de modale
			if (!creationData.deviceId) {
				createLine({ data: creationData });
				setValidationErrors({});
				return exitCreatingMode();
			}

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
				? (createLine({ data: creationData }),
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
			// Formatage des informations nécessaires pour la validation du schéma
			const updateData = {
				id: row.original.id,
				number,
				profile,
				status,
				comments,
				agentId:
					formattedAgents?.find((agent) => agent.infos === agentId)
						?.id || null,
				deviceId:
					formattedDevices?.find(
						(device) => device.infos === deviceId
					)?.id || null,
			} as LineUpdateType;

			// Validation du format des données via un schéma Zod
			const validation = lineUpdateSchema.safeParse(updateData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			const currentLineOwnerId = row.original.agentId ?? null;
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
			const currentDeviceId = row.original.deviceId || null;
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
			const currentLineOwnerFullName =
				formattedAgents?.find(
					(agent) => agent.id === currentLineOwnerId
				)?.infos || null;

			// Si aucun nouvel appareil
			// ou si l'appareil et le propriétaire n'ont pas été modifiés
			// ou si l'appareil et l'agent fournis sont déjà liés et l'appareil non affecté à une autre ligne, pas de modale
			!newDeviceId ||
			(currentDeviceId === newDeviceId &&
				currentLineOwnerId === newLineOwnerId) ||
			(!alreadyUsingDeviceLine && deviceCurrentOwnerId === newLineOwnerId)
				? (setValidationErrors({}),
				  updateLine({ data: updateData }),
				  table.setEditingRow(null))
				: displayLineUpdateModal({
						updateLine,
						exitUpdatingMode: () => table.setEditingRow(null),
						setValidationErrors,
						alreadyUsingDeviceLine,
						alreadyUsingDeviceLineOwnerFullName,
						deviceFullName,
						currentLineOwnerFullName,
						currentLineOwnerId,
						newLineOwnerFullName,
						newLineOwnerId,
						currentDeviceId,
						deviceCurrentOwnerId,
						deviceCurrentOwnerFullName,
						newDeviceId,
						updateData,
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
		columns,
		data: lines || [],
		enableGlobalFilter: true,
		enableColumnFilters: false,
		enableColumnActions: false,
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		enableHiding: false,
		sortDescFirst: true,
		enableSortingRemoval: false,
		enableDensityToggle: false,
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateLine,
		onEditingRowSave: handleSaveLine,
		onEditingRowCancel: () => setValidationErrors({}),
		paginationDisplayMode: 'pages',
		renderRowActions: ({ row, table }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
			/>
		),
		// TODO
		renderTopToolbarCustomActions: ({ table }) => (
			<>
				<CreateButton
					createFunction={() => table.setCreatingRow(true)}
				/>
				<Flex gap='xl' justify='center' align='center' flex={1} mb='xs'>
					<Button color='green'>Actives</Button>
					<Button color='orange'>En cours</Button>
					<Button color='red'>Résiliées</Button>
				</Flex>
			</>
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
				pageSize: 20, // rows per page
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
		<ZoomableComponent className='attributed-lines'>
			<h2>Lignes attribuées</h2>

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
		</ZoomableComponent>
	);
}
