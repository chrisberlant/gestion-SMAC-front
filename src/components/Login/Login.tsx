import {
	Button,
	LoadingOverlay,
	Paper,
	PasswordInput,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckLoginStatus, useLogin } from '@queries/userQueries';
import { userLoginSchema } from '../../validationSchemas/userSchemas';
import classes from './login.module.css';

export default function Login() {
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
		if (user) navigate('/lines');
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

						<div className={classes.serverStatus}>
							&Eacute;tat du serveur :{' '}
							{isLoading ? (
								<span>Vérification en cours...</span>
							) : (
								<>
									{error?.message === 'Failed to fetch' ? (
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
								</>
							)}
						</div>
					</Paper>
				</div>
			</main>
		);
	}
}
