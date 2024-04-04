import {
	ActionIcon,
	Flex,
	HoverCard,
	Loader,
	Tooltip,
	Text,
} from '@mantine/core';
import { IconCopy, IconMail } from '@tabler/icons-react';
import {
	useCreateAgent,
	useDeleteAgent,
	useExportAgentsToCsv,
	useGetAllAgents,
	useUpdateAgent,
} from '@queries/agentQueries';
import {
	agentCreationSchema,
	agentUpdateSchema,
} from '@validationSchemas/agentSchemas';
import {
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
} from '@customTypes/agent';
import { useGetAllServices } from '@queries/serviceQueries';
import SwitchButton from '../SwitchButton/SwitchButton';
import { toast } from 'sonner';
import { objectIncludesObject, optimizeData, sendEmail } from '@utils/index';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import CsvExportButton from '../CsvExportButton/CsvExportButton';
import displayAgentDeleteModal from '@modals/agentDeleteModal';
import CsvImportButton from '../CsvImportButton/CsvImportButton';

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
				enableHiding: false,
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
				Cell: ({ row }) => {
					const agentEmail = row.original.email;
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
				id: 'vip',
				accessorFn: (row) => (row.vip ? 'Oui' : 'Non'),
				size: 50,
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
				Cell: ({ row }) => (
					<span className={row.original.vip ? 'vip-text' : ''}>
						{row.original.vip ? 'Oui' : 'Non'}
					</span>
				),
			},
			{
				header: 'Service',
				id: 'serviceId',
				accessorFn: (row) =>
					services?.find((service) => service.id === row.serviceId)
						?.title,
				size: 80,
				editVariant: 'select',
				mantineEditSelectProps: {
					data: services?.map((service) => service.title),
					allowDeselect: false,
					error: validationErrors?.serviceId,
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
				accessorFn: (row) => row.devices?.length || 0,
				size: 75,
				// Affichage des IMEI au survol s'il y a des appareils à afficher
				Cell: ({ row, cell }) => {
					const devicesAmount = cell.getValue() as string;
					if (Number(devicesAmount) === 0) return devicesAmount;
					return (
						<HoverCard width={170} shadow='md' openDelay={400}>
							<HoverCard.Target>
								<span>{devicesAmount}</span>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								{row.original.devices.map((device) => (
									<Text key={device.id}>{device.imei}</Text>
								))}
							</HoverCard.Dropdown>
						</HoverCard>
					);
				},
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
							row.original.email.toLowerCase() ===
							data.email.toLowerCase().trim()
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

			// Formatage des données
			const newData = {
				lastName,
				firstName,
				email,
				vip: vipRef.current,
				serviceId: services?.find(
					(service) => service.title === values.serviceId
				)?.id,
			} as AgentType;

			const { devices, ...originalData } = row.original;

			// Si aucune modification des données
			if (objectIncludesObject(originalData, newData)) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Optimisation pour envoyer uniquement les données modifiées
			const newOptimizedData = optimizeData(
				originalData,
				newData
			) as AgentUpdateType;
			// Récupérer l'id dans les colonnes cachées
			newOptimizedData.id = row.original.id;

			// Validation du format des données via un schéma Zod
			const validation = agentUpdateSchema.safeParse(newOptimizedData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si une adresse mail est fournie, vérification si elle n'est pas déjà utilisée
			if (newOptimizedData.email) {
				if (
					table
						.getCoreRowModel()
						.rows.some(
							(row) =>
								row.original.email ===
									newData.email.toLowerCase().trim() &&
								row.original.id !== newOptimizedData.id
						)
				) {
					toast.error('Un agent avec cette adresse mail existe déjà');
					return setValidationErrors({
						email: ' ',
					});
				}
			}

			setValidationErrors({});
			updateAgent(newOptimizedData);
			table.setEditingRow(null);
		};

	const table = useMantineReactTable({
		columns,
		data: agents || [],
		enablePagination: false,
		enableRowVirtualization: true,
		enableGlobalFilter: true,
		enableColumnFilters: true,
		enableColumnOrdering: true,
		enableColumnActions: false,
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		enableHiding: true,
		enableDensityToggle: false,
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateAgent,
		onEditingRowSave: handleSaveAgent,
		onEditingRowCancel: () => setValidationErrors({}),
		mantineSearchTextInputProps: {
			placeholder: 'Rechercher',
			style: { minWidth: '300px' },
			variant: 'default',
		},
		mantineTableContainerProps: { style: { maxHeight: '60vh' } },
		renderRowActions: ({ row }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() =>
					displayAgentDeleteModal({ row, deleteAgent })
				}
			/>
		),
		renderTopToolbarCustomActions: () => (
			<>
				<CreateButton
					createFunction={() => table.setCreatingRow(true)}
				/>
				<CsvImportButton model='agents' />
			</>
		),
		renderBottomToolbarCustomActions: () => (
			<Flex justify='end' flex={1}>
				<CsvExportButton request={exportsAgentsToCsv} />
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
