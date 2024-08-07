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
import { Navigate } from 'react-router-dom';
import { useGetCurrentUser, useLogin } from '@/hooks/authQueries';
import { userLoginSchema } from '@/validationSchemas/userSchemas';
import classes from './login.module.css';

export default function Login() {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const {
		data: userIsAuthenticated,
		isLoading,
		error,
	} = useGetCurrentUser({ loginPage: true });
	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});
	const { mutate: submitLogin } = useLogin(form, toggleOverlay);

	if (userIsAuthenticated) return <Navigate to='/lines' replace />;

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
						Gestion SMAC - Connexion
					</Title>
					<form onSubmit={form.onSubmit(() => submitLogin())}>
						<LoadingOverlay
							visible={visible}
							zIndex={2}
							overlayProps={{ radius: 'sm', blur: 2 }}
						/>
						<TextInput
							label='Email'
							placeholder='Votre adresse mail'
							data-autofocus
							{...form.getInputProps('email')}
							size='md'
							labelProps={{ mb: '4' }}
						/>
						<PasswordInput
							label='Mot de passe'
							placeholder='Votre mot de passe'
							mt='md'
							{...form.getInputProps('password')}
							size='md'
							labelProps={{ mb: '4' }}
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
