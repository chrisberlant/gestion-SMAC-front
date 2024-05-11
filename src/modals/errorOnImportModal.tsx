import { modals } from '@mantine/modals';
import { Button, Flex, Text } from '@mantine/core';
import { toast } from 'sonner';

const displayErrorOnImportModal = (errorTexts: Record<string, string[]>) => {
	return modals.open({
		title: "Impossible d'importer le fichier CSV",
		size: 'md',
		centered: true,
		children: (
			<>
				{Object.entries(errorTexts).map(([key, values]) => (
					<div key={key}>
						<Text mb='xs'>{key}</Text>
						<Flex align='center' direction='column' mb='md'>
							{values.map((value) => (
								<Text key={value}>{value}</Text>
							))}
						</Flex>
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
