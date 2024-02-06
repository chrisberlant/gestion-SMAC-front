import { Switch, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// Ce bouton permet de récupérer la valeur par défaut fournie et de mettre à jour un state booléen du composant dans lequel il est intégré

function SwitchButton({
	defaultValue,
	setStateValue,
}: {
	defaultValue: boolean;
	setStateValue: Dispatch<SetStateAction<boolean>>;
}) {
	// State interne au bouton permettant de changer son style
	const [checked, setChecked] = useState(defaultValue);

	// Le state est tout d'abord initialisé via le booléen fourni
	useEffect(() => setStateValue(defaultValue), [defaultValue, setStateValue]);

	return (
		<Switch
			checked={checked}
			onChange={() => {
				setChecked((value) => !value);
				setStateValue((value) => !value);
			}}
			color='teal'
			size='md'
			thumbIcon={
				checked ? (
					<IconCheck
						style={{
							width: rem(12),
							height: rem(12),
						}}
						color='teal'
						stroke={3}
					/>
				) : (
					<IconX
						style={{
							width: rem(12),
							height: rem(12),
						}}
						color='red'
						stroke={3}
					/>
				)
			}
		/>
	);
}

export default SwitchButton;
