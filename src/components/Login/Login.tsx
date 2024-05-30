import {
	Text,
	Button,
	LoadingOverlay,
	Paper,
	PasswordInput,
	TextInput,
	Title,
	Flex,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckLoginStatus, useLogin } from '@queries/userQueries';
import { userLoginSchema } from '@validationSchemas/userSchemas';
import classes from './login.module.css';
import fetchApi from '@utils/fetchApi';
import { toast } from 'sonner';

export default function Login() {
	const [visible, { toggle: toggleOverlay }] = useDisclosure(false);
	const navigate = useNavigate();
	const { data: userIsConnected, isLoading, error } = useCheckLoginStatus();
	const [demoUserInfos, setDemoUserInfos] = useState<{
		email: string;
		password: string;
	} | null>(null);

	const form = useForm({
		validate: zodResolver(userLoginSchema),
		initialValues: {
			email: '',
			password: '',
		},
	});

	const { mutate: submitLogin } = useLogin(form, toggleOverlay);

	useEffect(() => {
		// Rediriger vers l'app si utilisateur déjà connecté
		if (userIsConnected) navigate('/lines');
	}, [userIsConnected, navigate]);

	const createDemoUser = async () => {
		const createdDemoUser = await fetchApi('/demo');
		setDemoUserInfos({
			email: createdDemoUser.email,
			password: createdDemoUser.password,
		});
		toast.success('Utilisateur créé avec succès !');
	};

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
						Gestion SMAC - Version de démonstration
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
					<Button
						mt='20%'
						fullWidth
						size='md'
						color='green'
						onClick={createDemoUser}
					>
						Créer un utilisateur de démonstration
					</Button>
					{demoUserInfos && (
						<Paper mt='xl' p='md' bg='gray' radius='md'>
							<Flex direction='column'>
								<Text>
									La base de données a été réinitialisée.
								</Text>
								<Text mt='sm'>
									Vous pouvez désormais vous connecter avec
									les identifiants :
								</Text>
								<Flex align='center' direction='column'>
									<Text fw={700}>{demoUserInfos.email}</Text>
									<Text fw={700}>
										{demoUserInfos.password}
									</Text>
									<Button
										mt='lg'
										w='80%'
										onClick={() =>
											form.setValues({
												email: demoUserInfos.email,
												password:
													demoUserInfos.password,
											})
										}
									>
										Renseigner automatiquement le formulaire
									</Button>
								</Flex>
							</Flex>
						</Paper>
					)}

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
