import { ActionIcon, Button, Flex, Loader, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useGetAllServices } from '@utils/serviceQueries';
import { lineCreationSchema } from '@validationSchemas/lineSchemas';
import {
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';

import { LineType } from '../../types/line';

import { useCreateLine, useGetAllLines } from '../../utils/lineQueries';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';
import { useGetAllAgents } from '../../utils/agentQueries';
import { useGetAllDevices } from '../../utils/deviceQueries';
import { useGetAllModels } from '../../utils/modelQueries';
import { useGetCurrentUser } from '../../utils/userQueries';

interface ValidationErrorsType {
	number: undefined | string;
	profile: undefined | string;
	status: undefined | string;
	comments: undefined | string;
	agent: {
		email: undefined | string;
		firstName: undefined | string;
		lastName: undefined | string;
		service: {
			title: undefined | string;
		};
	};
	device: {
		imei: undefined | string;
		preparationDate: undefined | string;
		attributionDate: undefined | string;
		status: undefined | string;
		isNew: undefined | string;
		comments: undefined | string;
		model: undefined | string;
	};
}

function ActiveLines() {
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
	const {
		data: lines,
		isLoading: linesLoading,
		isError: linesError,
	} = useGetAllLines();

	const { mutate: createLine } = useCreateLine();

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
			// onConfirm: () => deleteUser({ id: row.original.id }),
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
		// onCreatingRowCancel: () => setValidationErrors(initialState),
		// onCreatingRowSave: handleCreateLine,
		// onEditingRowSave: handleSaveUser,
		// onEditingRowCancel: () => setValidationErrors(initialState),
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

export default ActiveLines;
