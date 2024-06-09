import { Stack, Text } from '@mantine/core';

export default function AdminHomePage() {
	return (
		<Stack w='100%' align='center'>
			<h2>Bienvenue dans le tableau de bord d'administration</h2>
			<Text mt={20}>
				Veuillez sélectionner un onglet dans le menu de gauche
			</Text>
		</Stack>
	);
}
