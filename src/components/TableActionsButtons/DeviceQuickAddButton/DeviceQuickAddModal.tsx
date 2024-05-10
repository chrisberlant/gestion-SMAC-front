import { useGetAllDevices, useQuickCreateDevice } from '@queries/deviceQueries';
import { deviceQuickCreationSchema } from '@validationSchemas/deviceSchemas';
import {
	Modal,
	LoadingOverlay,
	Button,
	TextInput,
	Select,
	Flex,
	InputLabel,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/dates/styles.css';
import { toast } from 'sonner';
import { useMemo, useRef } from 'react';
import SwitchButton from '@components/SwitchButton/SwitchButton';
import { ModelType } from '@customTypes/model';
import { AgentType } from '@customTypes/agent';
import DateChoice from '@components/DateChoice/DateChoice';
import { DeviceCreationType } from '@customTypes/device';

interface DeviceAddModalProps {
	agents?: AgentType[];
	models?: ModelType[];
	openedDeviceAddModal: boolean;
	closeDeviceAddModal: () => void;
}

// Modale permettant d'ajouter un device rapidement
export default function DeviceQuickAddModal({
	agents,
	models,
	openedDeviceAddModal,
	closeDeviceAddModal,
}: DeviceAddModalProps) {
	const form = useForm({
		validate: zodResolver(deviceQuickCreationSchema),
		initialValues: {
			imei: '',
			status: 'En stock',
			modelId: '',
			isNew: true,
			agentId: '',
			preparationDate: '',
			attributionDate: '',
			comments: '',
		},
		transformValues: (values) =>
			({
				...values,
				modelId: Number(values.modelId),
				agentId: values.agentId ? Number(values.agentId) : null,
				isNew: isNewRef.current,
				preparationDate: preparationDateRef.current,
				attributionDate: attributionDateRef.current,
			} as DeviceCreationType),
	});

	// Fermeture de la modale, cancel est utilisé en cas de fermeture volontaire de la modale par l'utilisateur
	const closeModal = (cancel: 'cancel' | undefined = undefined) => {
		return () => {
			closeDeviceAddModal();
			if (cancel && form.isDirty())
				toast.warning("Aucune création d'appareil n'a été effectuée");
			form.reset();
		};
	};
	const preparationDateRef = useRef<string | null>(null);
	const attributionDateRef = useRef<string | null>(null);
	const isNewRef = useRef<boolean>(true);
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const { data: devices } = useGetAllDevices();
	const { mutate: createDevice } = useQuickCreateDevice(
		toggleOverlay,
		closeModal()
	);

	// Formatage des modèles et agents pour affichage dans la liste déroulante
	const formattedModels = useMemo(
		() =>
			models?.map((model) => ({
				value: model.id.toString(),
				label: `${model.brand} ${model.reference}${
					model.storage ? ` ${model.storage}` : ''
				}`,
			})),
		[models]
	);
	const formattedAgents = useMemo(
		() =>
			agents?.map((agent) => ({
				value: agent.id?.toString(),
				label: `${agent.lastName} ${agent.firstName}`,
			})),
		[agents]
	);

	const handleSubmit = () => {
		if (devices?.some((device) => device.imei === form.values.imei))
			return form.setFieldError(
				'email',
				'Un appareil avec cet IMEI existe déjà'
			);
		createDevice(form.getTransformedValues());
	};

	return (
		<Modal
			opened={openedDeviceAddModal}
			onClose={closeModal('cancel')}
			title="Ajout rapide d'un appareil"
			centered
			overlayProps={{
				blur: 3,
			}}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<LoadingOverlay
					visible={visible}
					zIndex={10}
					overlayProps={{ radius: 'sm', blur: 2 }}
				/>
				<TextInput
					label='IMEI'
					placeholder='IMEI'
					data-autofocus
					{...form.getInputProps('imei')}
					labelProps={{ mb: '4' }}
					mb='xs'
				/>
				<Select
					label='Statut'
					placeholder='Statut'
					data={[
						'En stock',
						'Attribué',
						'Restitué',
						'En attente de restitution',
						'En prêt',
						'En panne',
						'Volé',
					]}
					maxDropdownHeight={250}
					{...form.getInputProps('status')}
					labelProps={{ mb: '4' }}
					mb='xs'
				/>
				<Select
					label='Modèle'
					placeholder='Modèle'
					data={formattedModels}
					{...form.getInputProps('modelId')}
					searchable
					clearable
					labelProps={{ mb: '4' }}
					mb='md'
				/>
				<Flex gap={10} align='center' mb='xs'>
					<InputLabel>État</InputLabel>
					<SwitchButton
						size='lg'
						onLabel='Neuf'
						offLabel='Occasion'
						defaultValue={true}
						valueRef={isNewRef}
					/>
				</Flex>
				<Select
					label='Propriétaire'
					placeholder='Propriétaire'
					data={formattedAgents}
					{...form.getInputProps('agentId')}
					searchable
					clearable
					labelProps={{ mb: '4' }}
					mb='xs'
				/>
				<Flex direction='column' mb='xs'>
					<InputLabel mb={4}>Date de préparation</InputLabel>
					<DateChoice dateRef={preparationDateRef} />
				</Flex>
				<Flex direction='column' mb='xs'>
					<InputLabel mb={4}>Date d'attribution</InputLabel>
					<DateChoice dateRef={attributionDateRef} />
				</Flex>
				<TextInput
					label='Commentaires'
					placeholder='Commentaires'
					{...form.getInputProps('comments')}
					labelProps={{ mb: '4' }}
					mb='xl'
				/>
				<Button fullWidth mt='lg' type='submit'>
					Valider
				</Button>
				<Button
					fullWidth
					mt='md'
					color='gray'
					onClick={closeModal('cancel')}
				>
					Annuler
				</Button>
			</form>
		</Modal>
	);
}
