import { useGetAllAgents, useQuickCreateAgent } from '@queries/agentQueries';
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
import { useEffect, useMemo, useRef } from 'react';
import SwitchButton from '@components/SwitchButton/SwitchButton';
import { ServiceType } from '@customTypes/service';
import { AgentCreationType, AgentQuickCreationType } from '@customTypes/agent';
import { IconAt } from '@tabler/icons-react';

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
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	// Fermeture de la modale, cancel est utilisé en cas de fermeture volontaire de la modale par l'utilisateur
	const closeModal = (cancel: 'cancel' | undefined = undefined) => {
		return () => {
			closeAgentAddModal();
			if (cancel && form.isDirty())
				toast.warning("Aucune création d'agent n'a été effectuée");
			form.reset();
		};
	};
	const { data: agents } = useGetAllAgents();
	const { mutate: createAgent } = useQuickCreateAgent(
		toggleOverlay,
		closeModal()
	);
	const vipRef = useRef<boolean>(false);

	const form = useForm({
		initialValues: {
			lastName: '',
			firstName: '',
			email: '',
			vip: false,
			serviceId: '',
			emailDomain: null,
		} as AgentQuickCreationType,
		transformValues: (values) =>
			({
				lastName: values.lastName,
				firstName: values.firstName,
				serviceId: Number(values.serviceId),
				vip: vipRef.current,
				email: values.emailDomain
					? `${values.email}@${values.emailDomain}`
					: values.email,
			} as AgentCreationType),
		validate: zodResolver(agentQuickCreationSchema),
	});

	// Formatage des servicespour affichage dans la liste déroulante
	const servicesList = useMemo(
		() =>
			services?.map((service) => ({
				value: service.id.toString(),
				label: service.title,
			})),
		[services]
	);

	const handleSubmit = () => {
		if (agents?.some((agent) => agent.email === form.values.email))
			return form.setFieldError(
				'email',
				'Un agent avec cette adresse mail existe déjà'
			);
		createAgent(form.getTransformedValues());
	};

	useEffect(() => {
		if (form.values.email.includes('@'))
			form.setFieldValue('emailDomain', null);
	}, [form.values.email]);

	return (
		<Modal
			opened={openedAgentAddModal}
			size='lg'
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
					zIndex={2}
					overlayProps={{ radius: 'sm', blur: 2 }}
				/>

				<Flex align='center' gap={10}>
					<TextInput
						label='Adresse mail'
						placeholder='Adresse mail'
						{...form.getInputProps('email')}
						data-autofocus
						mb='xs'
						style={{
							width: 295,
						}}
						labelProps={{ mb: '4' }}
					/>
					<Select
						clearable={true}
						{...form.getInputProps('emailDomain')}
						{...(form.values.email.includes('@')
							? { disabled: true }
							: null)}
						data={['developpement-durable.gouv.fr', 'i-carre.net']}
						leftSection={<IconAt size={18} />}
						leftSectionPointerEvents='none'
						style={{
							width: 280,
						}}
						mt={18}
					/>
				</Flex>

				<TextInput
					label='Nom'
					placeholder='Nom'
					{...form.getInputProps('lastName')}
					labelProps={{ mb: '4' }}
					mb='xs'
				/>
				<TextInput
					label='Prénom'
					placeholder='Prénom'
					{...form.getInputProps('firstName')}
					labelProps={{ mb: '4' }}
					mb='xs'
				/>
				<Select
					label='Service'
					placeholder='Service'
					data={servicesList}
					{...form.getInputProps('serviceId')}
					searchable
					clearable
					labelProps={{ mb: '4' }}
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
					color='gray'
					onClick={closeModal('cancel')}
				>
					Annuler
				</Button>
			</form>
		</Modal>
	);
}
