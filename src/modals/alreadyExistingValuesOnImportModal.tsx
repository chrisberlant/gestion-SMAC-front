import { modals } from '@mantine/modals';
import { Button, Flex, Text } from '@mantine/core';
import { toast } from 'sonner';

interface displayAlreadyExistingValuesOnImportModalProps {
	text: string;
	values: string;
}

const displayAlreadyExistingValuesOnImportModal = ({
	text,
	values,
}: displayAlreadyExistingValuesOnImportModalProps) => {
	const valuesArray = values.split(',');

	return modals.open({
		title: "Impossible d'importer le fichier CSV",
		size: 'md',
		centered: true,
		children: (
			<>
				<Text mb='xs'>{text}</Text>
				<Flex align='center' direction='column'>
					{valuesArray.map((value) => (
						<Text key={value}>{value}</Text>
					))}
				</Flex>
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
