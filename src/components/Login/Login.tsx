import {
	Paper,
	TextInput,
	PasswordInput,
	Button,
	Title,
	LoadingOverlay,
} from '@mantine/core';
import classes from './login.module.css';
import { useForm, zodResolver } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useCheckLoginStatus, useLogin } from '../../utils/userQueries';
import { userLoginSchema } from '../../validationSchemas/userSchemas';
import { useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'sonner';

function Login() {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const navigate = useNavigate();
	// Rediriger vers l'app si utilisateur déjà connecté
	const { data: user } = useCheckLoginStatus();
	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});
	const { mutate: submitLogin } = useLogin(form, toggleOverlay);

	useEffect(() => {
		if (user) {
			navigate('/attributed-lines');
			toast.info(`Bienvenue, ${user!.firstName} !`);
		}
	}, [user, navigate]);

	return (
		<main className={classes.loginPage}>
			<div className={classes.wrapper}>
				<Paper className={classes.form} radius={0} p={30}>
					<Title
						order={1}
						className={classes.title}
						ta='center'
						mt='md'
						mb={50}
					>
						Gestion SMAC - BETA
					</Title>
					<form onSubmit={form.onSubmit(() => submitLogin())}>
						<LoadingOverlay
							visible={visible}
							zIndex={1000}
							overlayProps={{ radius: 'sm', blur: 2 }}
						/>
						<TextInput
							label='Email'
							placeholder='Votre adresse mail'
							size='md'
							data-autofocus
							{...form.getInputProps('email')}
						/>
						<PasswordInput
							label='Mot de passe'
							placeholder='Votre mot de passe'
							mt='md'
							size='md'
							{...form.getInputProps('password')}
						/>

						<Button type='submit' fullWidth mt='xl' size='md'>
							Connexion
						</Button>
					</form>
				</Paper>
			</div>
		</main>
	);
}

export default Login;
