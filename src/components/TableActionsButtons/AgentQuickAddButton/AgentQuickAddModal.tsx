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
import { useEffect, useMemo, useRef, useState } from 'react';
import SwitchButton from '@components/SwitchButton/SwitchButton';
import { ServiceType } from '@customTypes/service';
import { AgentCreationType } from '@customTypes/agent';
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
	const [emailDomain, setEmailDomain] = useState<{
		value: string | null;
		locked: boolean;
	}>({
		value: null,
		locked: false,
	});
	const vipRef = useRef<boolean>(false);
	// TODO validation zod des données transformées
	const form = useForm({
		validate: zodResolver(agentQuickCreationSchema),
		initialValues: {
			lastName: '',
			firstName: '',
			email: '',
			vip: false,
			serviceId: '',
		},
		transformValues: (values) =>
			({
				...values,
				serviceId: Number(values.serviceId),
				vip: vipRef.current,
				email: emailDomain.value
					? `${values.email}@${emailDomain.value}`
					: values.email,
			} as AgentCreationType),
	});
	console.log(form.getTransformedValues());

	useEffect(() => {
		// A l'insertion d'un @, verrouillage du champ permettant d'ajouter un nom de domaine
		if (form.values.email.includes('@'))
			return setEmailDomain({ value: null, locked: true });
		// Déverrouillage du champ si pas de @ et que le champ était verrouillé
		if (emailDomain.locked)
			return setEmailDomain((prev) => ({ ...prev, locked: false }));
	}, [form.values.email]);

	// Formatage des servicespour affichage dans la liste déroulante
	const formattedServices = useMemo(
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
					zIndex={10}
					overlayProps={{ radius: 'sm', blur: 2 }}
				/>
				<InputLabel>
					Adresse mail
					<Flex gap={10}>
						<TextInput
							placeholder='Adresse mail'
							{...form.getInputProps('email')}
							data-autofocus
							mb='xs'
							style={{
								width: 295,
							}}
						/>
						<Select
							clearable={true}
							{...(emailDomain.locked
								? { disabled: true }
								: null)}
							data={[
								'developpement-durable.gouv.fr',
								'i-carre.net',
							]}
							value={emailDomain.value}
							onChange={(value) =>
								setEmailDomain((prev) => ({
									...prev,
									value,
								}))
							}
							leftSection={<IconAt size={18} />}
							style={{
								width: 280,
							}}
						/>
					</Flex>
				</InputLabel>
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
					color='gray'
					onClick={closeModal('cancel')}
				>
					Annuler
				</Button>
			</form>
		</Modal>
	);
}
