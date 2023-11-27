import {
	TextInput,
	PasswordInput,
	Paper,
	Container,
	Button,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import fetchApi from '../../utils/fetchApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetCurrentUser } from '../../utils/queries';
import { userLoginSchema } from '../../validationSchemas/userSchemas';

function Login() {
	const navigate = useNavigate();
	// Rediriger vers l'app si utilisateur déjà connecté
	// const { data, isError } = useGetCurrentUser();

	// if (data) navigate('/active-lines');

	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});
	console.log(form.values);

	const onSubmit = async () => {
		try {
			console.log(form);
			await fetchApi('/login', 'POST', form.values);
			toast.success('Connexion réussie');
			navigate('/active-lines');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Container size={420} my={40}>
					<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
						<TextInput
							label='Email'
							placeholder='Votre adresse mail'
							mt='sm'
							{...form.getInputProps('email')}
						/>
						<PasswordInput
							label='Mot de passe'
							placeholder='Votre mot de passe'
							mt='sm'
							{...form.getInputProps('password')}
						/>
						<Button type='submit' fullWidth mt='xl'>
							Connexion
						</Button>
					</Paper>
				</Container>
			</form>
		</main>
	);
}

export default Login;
