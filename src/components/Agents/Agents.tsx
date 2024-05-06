import { ActionIcon, Flex, HoverCard, Tooltip, Text } from '@mantine/core';
import { IconCopy, IconDeviceMobile, IconMail } from '@tabler/icons-react';
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
import { getModifiedValues, sendEmail } from '@utils/index';
import EditDeleteButtons from '../TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import CreateButton from '../TableActionsButtons/CreateButton/CreateButton';
import CsvExportButton from '../CsvExportButton/CsvExportButton';
import displayAgentDeleteModal from '@modals/agentDeleteModal';
import CsvImportButton from '../CsvImportButton/CsvImportButton';
import { useGetAllDevices } from '../../queries/deviceQueries';
import Loading from '../Loading/Loading';
import { virtualizedTableConfig } from '@utils/tableConfig';

export default function Agents() {
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
	const { mutate: createAgent } = useCreateAgent();
	const { mutate: updateAgent } = useUpdateAgent();
	const { mutate: deleteAgent } = useDeleteAgent();
	const { refetch: exportsAgentsToCsv } = useExportAgentsToCsv();

	const anyLoading = servicesLoading || devicesLoading || agentsLoading;
	const anyError = servicesError || devicesError || agentsError;

	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});
	const vipRef = useRef<boolean>(true);

	// Pour chaque agent, récupérer sa liste d'appareils
	const devicesList = useMemo(() => {
		const devicesListPerAgent: Record<number, string[]> = {};
		devices?.forEach((device) => {
			if (device.agentId) {
				// Si la paire propriété/valeur correspondant à l'agent n'est pas créée
				if (!devicesListPerAgent[device.agentId]) {
					devicesListPerAgent[device.agentId] = [];
				}
				devicesListPerAgent[device.agentId].push(device.imei);
			}
		});
		return devicesListPerAgent;
	}, [devices]);

	// Services proposés dans la liste déroulante en cas d'ajout/mise à jour d'un agent
	const servicesList = useMemo(
		() =>
			services?.map((service) => ({
				value: service.id.toString(),
				label: service.title,
			})),
		[services]
	);

	const requiredData = agents && devices && services;

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
					type: 'email',
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
				accessorKey: 'vip',
				size: 50,
				mantineEditTextInputProps: {
					error: validationErrors?.vip,
					onFocus: () =>
						setValidationErrors({
							...validationErrors,
							vip: undefined,
						}),
				},
				Cell: ({ cell }) => (
					<span className={cell.getValue() ? 'vip-text' : ''}>
						{cell.getValue() ? 'Oui' : 'Non'}
					</span>
				),
				Edit: ({ cell }) => (
					<SwitchButton
						size='lg'
						defaultValue={cell.getValue() ? true : false}
						onLabel='Oui'
						offLabel='Non'
						valueRef={vipRef}
					/>
				),
			},
			{
				header: 'Service',
				id: 'serviceId',
				accessorFn: (row) => row.serviceId?.toString(),
				size: 80,
				editVariant: 'select',
				mantineEditSelectProps: {
					data: servicesList,
					allowDeselect: false,
					error: validationErrors?.serviceId,
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
				header: 'Appareils affectés',
				enableEditing: false,
				id: 'devices',
				accessorFn: (row) => devicesList[row.id]?.length || 0,
				size: 75,
				Cell: ({ row, cell }) => {
					// Ne rien afficher lors de la création
					if (!row.original.email) return null;
					const agentDevicesList = devicesList[row.original.id];
					const devicesAmount = cell.getValue() as number;
					if (devicesAmount === 0) return 0;
					// Affichage des IMEI au survol s'il y a des appareils affectés
					return (
						<HoverCard width={200} shadow='md' openDelay={400}>
							<HoverCard.Target>
								<span>{devicesAmount}</span>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								{agentDevicesList?.map((device) => (
									<Flex gap={5} key={device}>
										<IconDeviceMobile />
										<Text
											onClick={() => {
												navigator.clipboard.writeText(
													device
												);
												toast.info(
													'IMEI copié dans le presse-papiers'
												);
											}}
										>
											{device}
										</Text>
									</Flex>
								))}
							</HoverCard.Dropdown>
						</HoverCard>
					);
				},
			},
		],
		[validationErrors, servicesList, devicesList]
	);

	//CREATE action
	const handleCreateAgent: MRT_TableOptions<AgentType>['onCreatingRowSave'] =
		async ({ values, exitCreatingMode }) => {
			const { lastName, firstName, email, serviceId } = values;
			const creationData = {
				lastName: lastName.trim(),
				firstName: firstName.trim(),
				email: email.trim().toLowerCase(),
				vip: vipRef.current,
				serviceId: Number(serviceId),
			} as AgentCreationType;

			const validation = agentCreationSchema.safeParse(creationData);
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
						(row) => row.original.email === creationData.email
					)
			) {
				toast.error('Un agent avec cette adresse mail existe déjà');
				return setValidationErrors({
					email: ' ',
				});
			}

			setValidationErrors({});
			createAgent(creationData);
			exitCreatingMode();
		};

	//UPDATE action
	const handleSaveAgent: MRT_TableOptions<AgentType>['onEditingRowSave'] =
		async ({ values, row }) => {
			const { lastName, firstName, email, serviceId } = values;
			const { ...originalData } = row.original;

			// Formatage des données
			const updateData = {
				id: originalData.id,
				lastName: lastName.trim(),
				firstName: firstName.trim(),
				email: email.trim().toLowerCase(),
				vip: vipRef.current,
				serviceId: Number(serviceId),
			} as AgentType;

			// Optimisation pour envoyer uniquement les données modifiées
			const newModifiedData = getModifiedValues(
				originalData,
				updateData
			) as AgentUpdateType;

			// Si aucune modification des données
			if (Object.keys(newModifiedData).length < 2) {
				toast.warning('Aucune modification effectuée');
				table.setEditingRow(null);
				return setValidationErrors({});
			}

			// Validation du format des données via un schéma Zod
			const validation = agentUpdateSchema.safeParse(newModifiedData);
			if (!validation.success) {
				const errors: Record<string, string> = {};
				validation.error.issues.forEach((item) => {
					errors[item.path[0]] = item.message;
				});
				return setValidationErrors(errors);
			}

			// Si une adresse mail est fournie, vérification si elle n'est pas déjà utilisée
			if (newModifiedData.email) {
				if (
					table
						.getCoreRowModel()
						.rows.some(
							(row) =>
								row.original.email === newModifiedData.email &&
								row.original.id !== newModifiedData.id
						)
				) {
					toast.error('Un agent avec cette adresse mail existe déjà');
					return setValidationErrors({
						email: ' ',
					});
				}
			}

			updateAgent(newModifiedData);
			table.setEditingRow(null);
			return setValidationErrors({});
		};

	const table = useMantineReactTable({
		...virtualizedTableConfig,
		initialState: {
			sorting: [{ id: 'id', desc: true }],
			density: 'xs',
			columnVisibility: {
				id: false,
			},
		},
		columns,
		data: agents || [],
		displayColumnDefOptions: {
			'mrt-row-actions': {
				size: 20,
			},
		},
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateAgent,
		onEditingRowSave: handleSaveAgent,
		onEditingRowCancel: () => setValidationErrors({}),
		renderRowActions: ({ row }) => (
			<EditDeleteButtons
				editFunction={() => table.setEditingRow(row)}
				deleteFunction={() => {
					const { id, firstName, lastName } = row.original;
					return displayAgentDeleteModal({
						agentId: id,
						agentFullName: `${firstName} ${lastName}`,
						deleteAgent,
					});
				}}
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
	});

	return (
		<div className='agents-table'>
			<h2>Liste des agents</h2>
			{anyLoading && <Loading />}
			{anyError && (
				<span>
					Impossible de récupérer les agents depuis le serveur
				</span>
			)}

			{requiredData && <MantineReactTable table={table} />}
		</div>
	);
}
