import { Paper, TextInput, PasswordInput, Button, Title } from '@mantine/core';
import classes from './login.module.css';
import { useForm, zodResolver } from '@mantine/form';
import fetchApi from '../../utils/fetchApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetCurrentUser } from '../../utils/userQueries';
import { userLoginSchema } from '../../validationSchemas/userSchemas';

function Login() {
	const navigate = useNavigate();
	// Rediriger vers l'app si utilisateur déjà connecté
	// const { data, isError } = useGetCurrentUser();

	// if (data) navigate('/attributed-lines');

	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async () => {
		try {
			const request = await fetchApi('/login', 'POST', form.values);
			toast.info(`Bienvenue, ${request.firstName} !`);
			navigate('/attributed-lines');
		} catch (error) {
			form.setFieldValue('password', '');
			form.setErrors({ email: ' ', password: ' ' });
		}
	};

	return (
		<main className='login-page'>
			<div className={classes.wrapper}>
				<Paper className={classes.form} radius={0} p={30}>
					<Title
						order={2}
						className={classes.title}
						ta='center'
						mt='md'
						mb={50}
					>
						Gestion SMAC - BETA
					</Title>
					<form onSubmit={form.onSubmit(onSubmit)}>
						<TextInput
							label='Email'
							placeholder='Votre adresse mail'
							size='md'
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
