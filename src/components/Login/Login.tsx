import {
	TextInput,
	PasswordInput,
	Paper,
	Container,
	Button,
} from '@mantine/core';
// import classes from './login.module.css';
import { useForm } from '@mantine/form';

function Login() {
	const form = useForm({
		initialValues: {
			email: '',
			password: '',
		},
	});

	return (
		<form onSubmit={form.onSubmit((values) => console.log(values))}>
			<Container size={420} my={40}>
				<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
					<TextInput
						label='Email'
						placeholder='Votre adresse mail'
						required
						{...form.getInputProps('email')}
					/>
					<PasswordInput
						label='Mot de passe'
						placeholder='Votre mot de passe'
						required
						mt='md'
						{...form.getInputProps('password')}
					/>
					<Button type='submit' fullWidth mt='xl'>
						Connexion
					</Button>
				</Paper>
			</Container>
		</form>
	);
}

export default Login;
