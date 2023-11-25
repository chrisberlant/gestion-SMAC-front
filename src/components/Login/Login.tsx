import {
	TextInput,
	PasswordInput,
	Paper,
	Container,
	Button,
} from '@mantine/core';
// import classes from './login.module.css';
// import { SubmitHandler, useForm } from 'react-hook-form';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
import fetchApi from '../../utils/fetchApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetCurrentUser } from '../../utils/queries';
// import { zodResolver } from '@hookform/resolvers/zod';

const userLoginSchema = z.object({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
		})
		.min(1, "L'adresse mail doit être renseignée") // TODO message not triggering
		.email({ message: "Le format de l'adresse mail est incorrect" }),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseigné',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, { message: 'Le mot de passe doit faire minimum 8 caractères' }),
});

function Login() {
	const navigate = useNavigate();
	// Rediriger vers l'app si utilisateur déjà connecté
	const { data, isError } = useGetCurrentUser();
	if (isError) {
		console.log(isError);
	}
	// if (data) navigate('/active-lines');

	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async () => {
		try {
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
							autoComplete='on'
							label='Email'
							placeholder='Votre adresse mail'
							mt='sm'
							{...form.getInputProps('email')}
						/>
						<PasswordInput
							autoComplete='on'
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
