import {
	TextInput,
	PasswordInput,
	Paper,
	Container,
	Button,
} from '@mantine/core';
// import classes from './login.module.css';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect } from 'react';

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

type userLoginSchemaType = z.infer<typeof userLoginSchema>;

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<userLoginSchemaType>({
		resolver: zodResolver(userLoginSchema),
	});
	const onSubmit: SubmitHandler<userLoginSchemaType> = () =>
		console.log('Soumission réussie');

	useEffect(() => {
		const errorMessages = Object.values(errors);
		if (errorMessages.length > 0) {
			errorMessages.forEach((errorMessage) => {
				toast.error(errorMessage.message);
			});
		}
	}, [errors]);

	return (
		<main>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Container size={420} my={40}>
					<Paper withBorder shadow='md' p={30} mt={30} radius='md'>
						<TextInput
							// type='email'
							label='Email'
							placeholder='Votre adresse mail'
							required
							{...register('email')}
						/>
						<PasswordInput
							label='Mot de passe'
							placeholder='Votre mot de passe'
							required
							mt='md'
							{...register('password')}
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
