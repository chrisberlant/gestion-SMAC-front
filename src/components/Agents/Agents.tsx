import { ActionIcon, Button, Flex, Loader, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
	IconCopy,
	IconEdit,
	IconEditOff,
	IconMail,
	IconTrash,
	IconTrashOff,
} from '@tabler/icons-react';
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
import {
	AgentCreationType,
	AgentType,
	AgentUpdateType,
} from '../../types/agent';
import { useGetAllServices } from '../../utils/serviceQueries';
import { useGetCurrentUser } from '../../utils/userQueries';
import SwitchButton from '../SwitchButton/SwitchButton';
import { toast } from 'sonner';
import { sendEmail } from '../../utils/functions';

function AgentsTable() {
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
	const { mutate: createAgent } = useCreateAgent();
	const { mutate: updateAgent } = useUpdateAgent();
	const { mutate: deleteAgent } = useDeleteAgent();
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});

	const [vipState, setVipState] = useState(false);

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
				Cell: ({ row }) => (
					<span className={row.original.vip ? 'vip-text' : ''}>
						{row.original.lastName}
					</span>
				),
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
				Cell: ({ row }) => (
					<span className={row.original.vip ? 'vip-text' : ''}>
						{row.original.firstName}
					</span>
				),
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
				Cell: ({ row }) => (
					<Flex gap='xs' align='center'>
						<span className={row.original.vip ? 'vip-text' : ''}>
							{row.original.email}
						</span>
						<Tooltip label={`Copier ${row.original.email}`}>
							<ActionIcon
								size='xs'
								onClick={() => {
									navigator.clipboard.writeText(
										row.original.email
									);
									toast.info(
										'Adresse e-mail copiée dans le presse-papiers'
									);
								}}
							>
								<IconCopy />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={`E-mail à ${row.original.email}`}>
							<ActionIcon
								size='xs'
								onClick={() =>
									sendEmail(row.original.email, '', '')
								}
							>
								<IconMail />
							</ActionIcon>
						</Tooltip>
					</Flex>
				),
			},
			{
				header: 'VIP',
				id: 'vip',
				accessorFn: (row) => (row.vip ? 'Oui' : 'Non'),
				enableColumnFilter: false,
				mantineEditTextInputProps: {
					error: validationErrors?.vip,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							vip: undefined,
						}),
				},
				Edit: ({ row }) => (
					<SwitchButton
						size='sm'
						defaultValue={row.original.vip}
						setStateValue={setVipState}
					/>
				),
				Cell: ({ row }) => (
					<span className={row.original.vip ? 'vip-text' : ''}>
						{row.original.vip ? 'Oui' : 'Non'}
					</span>
				),
				size: 70,
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
					searchable: true,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							serviceId: undefined,
						}),
				},
				Cell: ({ row }) => (
					<span className={row.original.vip ? 'vip-text' : ''}>
						{
							services?.find(
								(service) =>
									service.id === row.original.serviceId
							)?.title
						}
					</span>
				),
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
			const { lastName, firstName, email } = values;
			const data = {
				lastName,
				firstName,
				email,
				vip: vipState,
				serviceId: services?.find(
					(service) => service.title === values.serviceId
				)?.id,
			} as AgentCreationType;
			const validation = agentCreationSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				// Conversion du tableau d'objets retourné par Zod en objet simple
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			setValidationErrors({});
			createAgent(data);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveAgent: MRT_TableOptions<AgentType>['onEditingRowSave'] =
		async ({ values, table, row }) => {
			const { lastName, firstName, email } = values;
			console.log(values);
			console.log(vipState);
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				id: row.original.id,
				lastName,
				firstName,
				email,
				vip: vipState,
				serviceId: services?.find(
					(service) => service.title === values.serviceId
				)?.id,
			} as AgentUpdateType;
			console.log(data);
			// Validation du format des données via un schéma Zod
			const validation = agentUpdateSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			setValidationErrors({});
			updateAgent(data);
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
			onConfirm: () => deleteAgent({ id: row.original.id! }),
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
