import { useCreateAgent } from '@queries/agentQueries';
import { agentQuickCreationSchema } from '@validationSchemas/agentSchemas';
import {
	Modal,
	LoadingOverlay,
	Button,
	TextInput,
	Select,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';
import { useRef } from 'react';
import SwitchButton from '@components/SwitchButton/SwitchButton';
import { ServiceType } from '@customTypes/service';
import { modals } from '@mantine/modals';

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
	const { mutate: createAgent } = useCreateAgent();
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

	// const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const closeModal = () => {
		closeAgentAddModal();
		form.reset();
		// Si des champs avaient été modifiés
		if (form.isDirty())
			toast.warning("Aucune création d'agent n'a été effectuée");
	};
	console.log(form.values);
	console.log('Transformed : ' + JSON.stringify(form.getTransformedValues()));

	return (
		<div>
			<Modal
				opened={openedAgentAddModal}
				onClose={closeModal}
				title="Ajout rapide d'un agent"
				centered
				overlayProps={{
					blur: 3,
				}}
			>
				<form
					onSubmit={form.onSubmit(() => {
						createAgent(form.getTransformedValues());
						// form.reset();
						// closeModal();
					})}
				>
					{/* <LoadingOverlay
						visible={visible}
						zIndex={10}
						overlayProps={{ radius: 'sm', blur: 2 }}
					/> */}
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
						mb='xl'
					/>
					VIP :
					<SwitchButton
						size='lg'
						defaultValue={false}
						valueRef={vipRef}
					/>
					<Select
						searchable
						label='Service'
						placeholder='Service'
						data={formattedServices}
						{...form.getInputProps('serviceId')}
					/>
					<Button fullWidth mt='xl' type='submit'>
						Valider
					</Button>
					<Button fullWidth mt='md' color='grey' onClick={closeModal}>
						Annuler
					</Button>
				</form>
			</Modal>
		</div>
	);
}
