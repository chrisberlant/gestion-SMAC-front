import { modals } from '@mantine/modals';
import { Button, Flex, Text } from '@mantine/core';
import { toast } from 'sonner';

interface DisplayAlreadyExistingEmailsOnImportModalProps {
	emails: string;
}

const displayAlreadyExistingEmailsOnImportModal = ({
	emails,
}: DisplayAlreadyExistingEmailsOnImportModalProps) => {
	const emailsArray = emails.split(',');

	return modals.open({
		title: "Impossible d'importer le fichier CSV",
		size: 'md',
		centered: true,
		children: (
			<>
				<Text mb='xs'>
					Certaines adresses mail fournies sont déjà existantes :
				</Text>
				<Flex align='center' direction='column'>
					{emailsArray.map((email) => (
						<Text key={email}>{email}</Text>
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
							toast.warning('CSV non importé');
						}}
					>
						Valider
					</Button>
				</Flex>
			</>
		),
	});
};

export default displayAlreadyExistingEmailsOnImportModal;
