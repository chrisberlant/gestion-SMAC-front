import { useCreateAgent, useGetAllAgents } from '@queries/agentQueries';
import { agentQuickCreationSchema } from '@validationSchemas/agentSchemas';
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
import { toast } from 'sonner';
import { useRef } from 'react';
import SwitchButton from '@components/SwitchButton/SwitchButton';
import { ServiceType } from '@customTypes/service';

interface AgentAddModalProps {
	services?: ServiceType[];
	openedAgentAddModal: boolean;
	closeAgentAddModal: () => void;
}

// Modale permettant d'ajouter un agent rapidement
export default function AgentQuickAddModal({
	services,
	openedAgentAddModal,
	closeAgentAddModal,
}: AgentAddModalProps) {
	// Fermeture de la modale, cancel est utilisé en cas de fermeture volontaire de la modale par l'utilisateur
	const closeModal = (cancel: 'cancel' | undefined = undefined) => {
		return () => {
			closeAgentAddModal();
			form.reset();
			if (cancel && form.isDirty())
				toast.warning("Aucune création d'agent n'a été effectuée");
		};
	};
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const { data: agents } = useGetAllAgents();
	const { mutate: createAgent } = useCreateAgent(toggleOverlay, closeModal());
	const form = useForm({
		validate: zodResolver(agentQuickCreationSchema),
		initialValues: {
			lastName: '',
			firstName: '',
			email: '',
			vip: false,
			serviceId: '',
		},
		transformValues: (values) => ({
			...values,
			serviceId: Number(values.serviceId),
			vip: vipRef.current,
		}),
	});
	const vipRef = useRef<boolean>(false);

	const formattedServices = services?.map((service) => ({
		value: service.id.toString(),
		label: service.title,
	}));

	const handleSubmit = () => {
		if (agents?.find((agent) => agent.email === form.values.email))
			return form.setFieldError(
				'email',
				'Un agent avec cette adresse mail existe déjà'
			);
		createAgent(form.getTransformedValues());
	};

	return (
		<div>
			<Modal
				opened={openedAgentAddModal}
				onClose={closeModal('cancel')}
				title="Ajout rapide d'un agent"
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
						label='Adresse mail'
						placeholder='Adresse mail'
						data-autofocus
						{...form.getInputProps('email')}
						mb='xs'
					/>
					<TextInput
						label='Nom'
						placeholder='Nom'
						{...form.getInputProps('lastName')}
						mb='xs'
					/>
					<TextInput
						label='Prénom'
						placeholder='Prénom'
						{...form.getInputProps('firstName')}
						mb='xs'
					/>
					<Select
						label='Service'
						placeholder='Service'
						data={formattedServices}
						{...form.getInputProps('serviceId')}
						searchable
						clearable
						mb='md'
					/>
					<Flex gap={5} align='center'>
						<InputLabel>VIP</InputLabel>
						<SwitchButton
							size='lg'
							onLabel='Oui'
							offLabel='Non'
							defaultValue={false}
							valueRef={vipRef}
						/>
					</Flex>
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
