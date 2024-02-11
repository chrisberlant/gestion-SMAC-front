import { Loader, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
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
				// enableClickToCopy: true,
				// mantineCopyButtonProps: {
				// 	style: { fontSize: 14 },
				// },
			},
			{
				header: 'Profil',
				accessorKey: 'profile',
				editVariant: 'select',
				size: 50,
				mantineEditSelectProps: {
					data: ['VD', 'V', 'D'], // Options disponibles dans le menu déroulant
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
				size: 90,
				mantineEditSelectProps: {
					data: ['Active', 'En cours', 'Résiliée'],
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

				// accessorFn: (row) => (
				// 	<Flex gap='xs' justify='center' align='center'>
				// 		<Tooltip label={`Copier ${row.agent.email}`}>
				// 			<ActionIcon
				// 				size='xs'
				// 				onClick={() => {
				// 					navigator.clipboard.writeText(
				// 						row.agent.email
				// 					);
				// 					toast.info(
				// 						'Adresse e-mail copiée dans le presse-papiers'
				// 					);
				// 				}}
				// 			>
				// 				<IconCopy />
				// 			</ActionIcon>
				// 		</Tooltip>
				// 		<Tooltip label={`E-mail à ${row.agent.email}`}>
				// 			<ActionIcon
				// 				size='xs'
				// 				onClick={() =>
				// 					sendEmail(row.agent.email, '', '')
				// 				}
				// 			>
				// 				<IconMail />
				// 			</ActionIcon>
				// 		</Tooltip>
				// 	</Flex>
				// ),
			},
			{
				header: 'Appareil',
				id: 'deviceId',
				accessorFn: (row) => {
					const currentDevice = formattedDevices?.find(
						(device) => device.id === row.deviceId
					);
					return currentDevice?.infos ? (
						currentDevice?.infos
					) : (
						<span className='personal-device-text'>
							Aucun appareil (ou personnel)
						</span>
					);
				},
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
			},
		],
		[validationErrors, formattedAgents, formattedDevices]
	);

	//CREATE action
	const handleCreateLine: MRT_TableOptions<LineType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { number, profile, status, comments, agentId, deviceId } =
				values;
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				number,
				profile,
				status,
				comments,
				agentId: formattedAgents?.find(
					(agent) => agent.infos === agentId
				)?.id,
				deviceId: formattedDevices?.find(
					(device) => device.infos === deviceId
				)?.id,
			} as LineCreationType;

			const validation = lineCreationSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			setValidationErrors({});
			createLine(data);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveLine: MRT_TableOptions<LineType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const { number, profile, status, comments, deviceId, agentId } =
				values;
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				id: row.original.id,
				number,
				profile,
				status,
				comments,
				agentId: formattedAgents?.find(
					(agent) => agent.infos === agentId
				)?.id,
				deviceId: formattedDevices?.find(
					(device) => device.infos === deviceId
				)?.id,
			} as LineUpdateType;

			// Validation du format des données via un schéma Zod
			const validation = lineUpdateSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}
			setValidationErrors({});
			updateLine(data);
			table.setEditingRow(null);
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<LineType>) =>
		modals.openConfirmModal({
			title: "Suppression d'une ligne",
			children: (
				<Text>
					Voulez-vous vraiment supprimer la ligne{' '}
					<span className='bold-text'>{row.original.number}</span> ?
					Cette action est irréversible.
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteLine({ id: row.original.id }),
		});

	const table = useMantineReactTable({
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
		renderTopToolbarCustomActions: ({ table }) => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
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

			{(linesLoading ||
				servicesLoading ||
				devicesLoading ||
				agentsLoading ||
				modelsLoading) && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{(linesError ||
				servicesError ||
				devicesError ||
				agentsError ||
				modelsError) && (
				<span>
					Impossible de récupérer les appareils depuis le serveur
				</span>
			)}

			{lines && devices && services && agents && models && (
				<MantineReactTable table={table} />
			)}
		</ZoomableComponent>
	);
}
