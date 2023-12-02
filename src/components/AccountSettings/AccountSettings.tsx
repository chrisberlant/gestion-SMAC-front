import { Menu, rem, TextInput, Button } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useGetCurrentUser } from '../../utils/userQueries';

function AccountSettings() {
	const { data: currentUser } = useGetCurrentUser();

	return (
		<>
			<Menu.Item
				leftSection={
					<IconSettings
						style={{
							width: rem(16),
							height: rem(16),
						}}
						stroke={1.5}
					/>
				}
				onClick={() => {
					modals.open({
						// size: 'xl',
						title: 'Paramètres du compte',
						children: (
							<>
								<TextInput
									label='Adresse mail'
									placeholder='Votre email'
									value={currentUser?.email}
									data-autofocus
								/>
								<TextInput
									label='Nom'
									placeholder='Votre nom'
									value={currentUser?.lastName}
									data-autofocus
								/>
								<TextInput
									label='Prénom'
									placeholder='Votre prénom'
									value={currentUser?.firstName}
									data-autofocus
								/>
								<Button
									fullWidth
									onClick={() => modals.closeAll()}
									mt='md'
								>
									Valider
								</Button>
							</>
						),
					});
				}}
			>
				Paramètres du compte
			</Menu.Item>
		</>
	);
}

export default AccountSettings;
