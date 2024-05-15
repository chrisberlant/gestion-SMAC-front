import { modals } from '@mantine/modals';
import { Button, Flex, Text } from '@mantine/core';
import { toast } from 'sonner';

const displayErrorOnImportModal = (
	errors: {
		message: string;
		values: string[];
	}[]
) => {
	return modals.open({
		title: "Impossible d'importer le fichier CSV",
		size: 'md',
		centered: true,
		children: (
			<>
				{errors.map((error) => (
					<div key={error.message}>
						<Text mb='xs'>{error.message}</Text>
						<ul>
							{error.values.map((value) => (
								<li key={value}> {value}</li>
							))}
						</ul>
					</div>
				))}

				<Text mt='lg'>
					Veuillez éditer le fichier et réeffectuer l'import.
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

export default displayErrorOnImportModal;
