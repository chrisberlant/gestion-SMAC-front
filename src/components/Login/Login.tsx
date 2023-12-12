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

function Login() {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const navigate = useNavigate();
	// Rediriger vers l'app si utilisateur déjà connecté
	const {
		data: user,
		isError: isNotConnected,
		isLoading,
		error,
	} = useCheckLoginStatus();
	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});
	const { mutate: submitLogin } = useLogin(form, toggleOverlay);

	useEffect(() => {
		if (user) navigate('/attributed-lines');
	}, [user, navigate]);

	if (isNotConnected || isLoading) {
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
						{isNotConnected && (
							<div className={classes.serverStatus}>
								&Eacute;tat du serveur :{' '}
								{error.message === 'Failed to fetch' ? (
									<span className={classes.statusRed}>
										<span
											className={classes.statusDot}
										></span>
										Hors ligne
									</span>
								) : (
									<span className={classes.statusGreen}>
										<span
											className={`${classes.statusDot} ${classes.statusDotAnimated}`}
										></span>
										En ligne
									</span>
								)}
							</div>
						)}
					</Paper>
				</div>
			</main>
		);
	}
}

export default Login;
