import {
	TextInput,
	PasswordInput,
	Paper,
	Container,
	Button,
} from '@mantine/core';
import classes from './login.module.css';
// import { SubmitHandler, useForm } from 'react-hook-form';
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';

const userLoginSchema = z.object({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
		})
		.email({ message: "Le format de l'adresse mail est incorrect" }),
	password: z
		.string({
			required_error: 'Le mot de passe doit être renseignée',
			invalid_type_error:
				'Le mot de passe doit être une chaîne de caractères',
		})
		.min(8, { message: 'Le mot de passe doit faire minimum 8 caractères' }),
});

function Login() {
	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = () => {
		console.log(form.values);
	};

	return (
		<main>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Container size={420} my={40}>
					<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
						<TextInput
							// type='email'
							label='Email'
							placeholder='Votre adresse mail'
							withAsterisk
							mt='sm'
							{...form.getInputProps('email')}
						/>

						<PasswordInput
							label='Mot de passe'
							placeholder='Votre mot de passe'
							withAsterisk
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
