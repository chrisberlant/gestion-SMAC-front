import { modals } from '@mantine/modals';
import { Button, Flex, Text } from '@mantine/core';
import { toast } from 'sonner';

interface displayAlreadyExistingValuesOnImportModalProps {
	text: string; // Contient le message d'erreur à afficher
	values: string[]; // Contient les valeurs
	secondaryText?: string; // optionnel pour un message d'erreur plus précis (utilisé pour les lignes)
	secondaryValues?: string[];
}

const displayAlreadyExistingValuesOnImportModal = ({
	text,
	values,
	secondaryText,
	secondaryValues,
}: displayAlreadyExistingValuesOnImportModalProps) => {
	return modals.open({
		title: "Impossible d'importer le fichier CSV",
		size: 'md',
		centered: true,
		children: (
			<>
				<Text mb='xs'>{text}</Text>
				<Flex align='center' direction='column' mb='md'>
					{values.map((value) => (
						<Text key={value}>{value}</Text>
					))}
				</Flex>
				{secondaryText && secondaryValues && (
					<>
						<Text mb='xs'>{secondaryText}</Text>
						<Flex align='center' direction='column'>
							{secondaryValues.map((value) => (
								<Text key={value}>{value}</Text>
							))}
						</Flex>
					</>
				)}
				<Text mt='lg'>
					Veuillez les retirer du fichier et réeffectuer l'import.
				</Text>
				<Flex align='center'>
					<Button
						fullWidth
						color='red'
						mt='lg'
						mx='md'
						onClick={() => {
							modals.closeAll();
							toast.warning("Aucun import n'a été effectué");
						}}
					>
						Valider
					</Button>
				</Flex>
			</>
		),
	});
};

export default displayAlreadyExistingValuesOnImportModal;
