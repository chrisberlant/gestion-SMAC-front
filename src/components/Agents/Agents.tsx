import { ActionIcon, Button, Flex, Loader, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
	useCreateAgent,
	useDeleteAgent,
	useGetAllAgents,
	useUpdateAgent,
} from '@utils/agentQueries';
import {
	agentCreationSchema,
	agentUpdateSchema,
} from '@validationSchemas/agentSchemas';
import {
	MRT_Row,
	MRT_TableOptions,
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { AgentType } from '../../types';
import { useGetAllServices } from '../../utils/serviceQueries';

function AgentsTable() {
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
	const { mutate: createAgent } = useCreateAgent();
	const { mutate: updateAgent } = useUpdateAgent();
	const { mutate: deleteAgent } = useDeleteAgent();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const columns = useMemo<MRT_ColumnDef<AgentType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				enableEditing: false,
			},
			{
				header: 'Nom',
				accessorKey: 'lastName',
				size: 150,
				mantineEditTextInputProps: {
					error: validationErrors?.lastName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							lastName: undefined,
						}),
				},
				Cell: ({ row }) => {
					return (
						<span className={row.original.vip ? 'vip-text' : ''}>
							{row.original.lastName}
						</span>
					);
				},
			},
			{
				header: 'Prénom',
				accessorKey: 'firstName',
				size: 150,
				mantineEditTextInputProps: {
					error: validationErrors?.firstName,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							firstName: undefined,
						}),
				},
				Cell: ({ row }) => {
					return (
						<span className={row.original.vip ? 'vip-text' : ''}>
							{row.original.firstName}
						</span>
					);
				},
			},
			{
				header: 'Email',
				accessorKey: 'email',
				size: 100,
				mantineEditTextInputProps: {
					error: validationErrors?.email,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							email: undefined,
						}),
				},
				Cell: ({ row }) => {
					return (
						<span className={row.original.vip ? 'vip-text' : ''}>
							{row.original.email}
						</span>
					);
				},
			},
			{
				header: 'VIP',
				id: 'vip',
				enableColumnFilter: false,
				accessorFn: (row) => (row.vip ? 'Oui' : 'Non'),
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: ['Oui', 'Non'],
					error: validationErrors?.vip,
					searchable: false,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							vip: undefined,
						}),
				},
			},
			{
				header: 'Service',
				id: 'serviceId',
				accessorFn: (row) =>
					services?.find((service) => service.id === row.serviceId)
						?.title,
				editVariant: 'select',
				size: 100,
				mantineEditSelectProps: {
					data: services?.map((service) => service.title),
					error: validationErrors?.serviceId,
					searchable: false,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							serviceId: undefined,
						}),
				},
			},
			{
				header: 'Appareils possédés',
				id: 'devices',
				enableEditing: false,
				accessorFn: (row) => row.devices?.length,
				size: 80,
			},
		],
		[services, validationErrors]
	);

	//CREATE action
	const handleCreateAgent: MRT_TableOptions<AgentType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			// Conversion en booléen du statut VIP
			values.vip = values.vip === 'Oui' ? true : false;
			values.serviceId = services?.find(
				(service) => service.title === values.serviceId
			)?.id;
			delete values.devices;

			const validation = agentCreationSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			setValidationErrors({});
			createAgent(values);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveAgent: MRT_TableOptions<AgentType>['onEditingRowSave'] =
		async ({ values, table, row }) => {
			// Récupérer l'id dans les colonnes cachées et l'ajouter aux données à valider
			values.id = row.original.id;
			// Conversion en booléen du statut VIP
			values.vip = values.vip === 'Oui' ? true : false;
			// Récupération de l'id du service en fonction de son titre
			values.serviceId = services?.find(
				(service) => service.title === values.serviceId
			)?.id;

			// Validation du format des données via un schéma Zod
			const validation = agentUpdateSchema.safeParse(values);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			setValidationErrors({});
			updateAgent(values);
			table.setEditingRow(null);
		};

	//DELETE action
	const openDeleteConfirmModal = (row: MRT_Row<AgentType>) =>
		modals.openConfirmModal({
			title: "Suppression d'un agent",
			children: (
				<Text>
					Voulez-vous vraiment supprimer l'agent{' '}
					<span className='bold-text'>
						{row.original.firstName} {row.original.lastName}
					</span>{' '}
					? Cette action est irréversible.
				</Text>
			),
			centered: true,
			overlayProps: {
				blur: 3,
			},
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onConfirm: () => deleteAgent({ id: row.original.id }),
		});

	const table = useMantineReactTable({
		columns,
		data: agents || [],
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
		onCreatingRowSave: handleCreateAgent,
		onEditingRowSave: handleSaveAgent,
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
		<div className='agents-table'>
			<h2>Liste des agents</h2>
			{(servicesLoading || agentsLoading) && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}
			{(servicesError || agentsError) && (
				<span>
					Impossible de récupérer les agents depuis le serveur
				</span>
			)}
			{agents && services && <MantineReactTable table={table} />}
		</div>
	);
}

export default AgentsTable;
