import { ActionIcon, Flex, Loader, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconCopy, IconMail } from '@tabler/icons-react';
import {
	useCreateAgent,
	useDeleteAgent,
	useExportAgentsToCsv,
	useGetAllAgents,
	useUpdateAgent,
} from '@/queries/agentQueries';
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
import { useMemo, useRef, useState } from 'react';
import {
	AgentCreationType,
	AgentType,
	AgentUpdateType,
} from '../../types/agent';
import { useGetAllServices } from '../../queries/serviceQueries';
import SwitchButton from '../SwitchButton/SwitchButton';
import { toast } from 'sonner';
import { sendEmail } from '../../utils/functions';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import ExportToCsvButton from '../ExportToCsvButton/ExportToCsvButton';

export default function AgentsTable() {
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
	const { refetch: exportsAgentsToCsv } = useExportAgentsToCsv();

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});
	const vipRef = useRef<boolean>(true);

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
				size: 120,
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
				size: 100,
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
				size: 150,
				mantineEditTextInputProps: {
					error: validationErrors?.email,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							email: undefined,
						}),
				},
				Cell: ({ cell, row }) => {
					const agentEmail = cell.getValue() as string;
					return (
						<Flex gap='xs' align='center'>
							<span
								className={row.original.vip ? 'vip-text' : ''}
							>
								{agentEmail}
							</span>
							<Tooltip label={`Copier ${agentEmail}`}>
								<ActionIcon
									size='xs'
									onClick={() => {
										navigator.clipboard.writeText(
											agentEmail
										);
										toast.info(
											'Adresse e-mail copiée dans le presse-papiers'
										);
									}}
								>
									<IconCopy />
								</ActionIcon>
							</Tooltip>
							<Tooltip label={`E-mail à ${agentEmail}`}>
								<ActionIcon
									size='xs'
									onClick={() =>
										sendEmail(agentEmail, '', '')
									}
								>
									<IconMail />
								</ActionIcon>
							</Tooltip>
						</Flex>
					);
				},
			},
			{
				header: 'VIP',
				accessorKey: 'vip',
				size: 20,
				enableColumnFilter: false,
				mantineEditTextInputProps: {
					error: validationErrors?.vip,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							vip: undefined,
						}),
				},
				Edit: ({ cell }) => (
					<SwitchButton
						size='sm'
						defaultValue={cell.getValue() ? true : false}
						valueRef={vipRef}
					/>
				),
				Cell: ({ cell }) => (
					<span className={cell.getValue() ? 'vip-text' : ''}>
						{cell.getValue() ? 'Oui' : 'Non'}
					</span>
				),
			},
			{
				header: 'Service',
				id: 'serviceId',
				accessorFn: (row) =>
					services?.find((service) => service.id === row.serviceId)
						?.title,
				size: 100,
				editVariant: 'select',
				mantineEditSelectProps: {
					data: services?.map((service) => service.title),
					allowDeselect: false,
					error: validationErrors?.serviceId,
					searchable: true,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							serviceId: undefined,
						}),
				},
				Cell: ({ row, cell }) => {
					const serviceTitle = cell.getValue() as string;
					return (
						<span className={row.original.vip ? 'vip-text' : ''}>
							{serviceTitle}
						</span>
					);
				},
			},
			{
				header: "Nb d'appareils",
				id: 'devices',
				enableEditing: false,
				accessorFn: (row) => row.devices?.length,
				size: 75,
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
				vip: vipRef.current,
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

			// Si l'agent existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.email.toLocaleLowerCase() ===
							data.email.toLocaleLowerCase().trim()
					)
			) {
				toast.error('Un agent avec cette adresse mail existe déjà');
				return setValidationErrors({
					email: ' ',
				});
			}

			setValidationErrors({});
			createAgent(data);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveAgent: MRT_TableOptions<AgentType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const { lastName, firstName, email } = values;
			// Formatage des informations nécessaires pour la validation du schéma
			const data = {
				id: row.original.id,
				lastName,
				firstName,
				email,
				vip: vipRef.current,
				serviceId: services?.find(
					(service) => service.title === values.serviceId
				)?.id,
			} as AgentUpdateType;
			// Validation du format des données via un schéma Zod
			const validation = agentUpdateSchema.safeParse(data);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si l'agent existe déjà
			if (
				table
					.getCoreRowModel()
					.rows.some(
						(row) =>
							row.original.email.toLocaleLowerCase() ===
								data.email.toLocaleLowerCase().trim() &&
							row.original.id !== data.id
					)
			) {
				toast.error('Un agent avec cette adresse mail existe déjà');
				return setValidationErrors({
					email: ' ',
				});
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
		enablePagination: false,
		enableRowVirtualization: true,
		enableGlobalFilter: true,
		enableColumnFilters: false,
		enableColumnOrdering: true,
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
		renderRowActions: ({ row, table }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => openDeleteConfirmModal(row)}
			/>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<CreateButton createFunction={() => table.setCreatingRow(true)} />
		),
		renderBottomToolbarCustomActions: () => (
			<Flex justify='end' flex={1}>
				<ExportToCsvButton request={exportsAgentsToCsv} />
			</Flex>
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
			columnVisibility: {
				id: false,
			},
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
