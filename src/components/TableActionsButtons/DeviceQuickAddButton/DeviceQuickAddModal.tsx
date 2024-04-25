import { useCreateDevice, useGetAllDevices } from '@queries/deviceQueries';
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
import { useRef } from 'react';
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
	// Fermeture de la modale, cancel est utilisé en cas de fermeture volontaire de la modale par l'utilisateur
	const closeModal = (cancel: 'cancel' | undefined = undefined) => {
		return () => {
			closeDeviceAddModal();
			form.reset();
			if (cancel && form.isDirty())
				toast.warning("Aucune création d'appareil n'a été effectuée");
		};
	};
	const preparationDateRef = useRef<string | null>(null);
	const attributionDateRef = useRef<string | null>(null);
	const isNewRef = useRef<boolean>(true);
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const { data: devices } = useGetAllDevices();
	const { mutate: createDevice } = useCreateDevice(
		toggleOverlay,
		closeModal()
	);
	const form = useForm({
		validate: zodResolver(deviceQuickCreationSchema),
		initialValues: {
			imei: '',
			status: 'En stock',
			modelId: '',
			isNew: true,
			agentId: null,
			preparationDate: null,
			attributionDate: null,
			comments: null,
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

	console.log(form.values);
	console.log('Transformed : ' + JSON.stringify(form.getTransformedValues()));

	const formattedModels = models?.map((model) => ({
		value: model.id.toString(),
		label: `${model.brand} ${model.reference}${
			model.storage ? ` ${model.storage}` : ''
		}`,
	}));
	const formattedAgents = agents?.map((agent) => ({
		value: agent.id.toString(),
		label: `${agent.lastName} ${agent.firstName}`,
	}));

	const handleSubmit = () => {
		if (devices?.find((device) => device.imei === form.values.imei))
			return form.setFieldError(
				'email',
				'Un appareil avec cet IMEI existe déjà'
			);
		createDevice(form.getTransformedValues());
	};

	return (
		<div>
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
						{...form.getInputProps('status')}
						mb='xs'
					/>
					<Select
						label='Modèle'
						placeholder='Modèle'
						data={formattedModels}
						{...form.getInputProps('modelId')}
						searchable
						clearable
						mb='md'
					/>
					<Flex gap={5} align='center' mb='xs'>
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
						mb='xs'
					/>
					<Flex direction='column' mb='xs'>
						<InputLabel>Date de préparation</InputLabel>
						<DateChoice dateRef={preparationDateRef} />
					</Flex>
					<Flex direction='column' mb='xs'>
						<InputLabel>Date d'attribution</InputLabel>
						<DateChoice dateRef={attributionDateRef} />
					</Flex>
					<TextInput
						label='Commentaires'
						placeholder='Commentaires'
						data-autofocus
						{...form.getInputProps('comments')}
						mb='xl'
					/>
					<Button fullWidth mt='lg' type='submit'>
						Valider
					</Button>
					<Button
						fullWidth
						mt='md'
						color='grey'
						onClick={closeModal('cancel')}
					>
						Annuler
					</Button>
				</form>
			</Modal>
		</div>
	);
}
