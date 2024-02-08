import { Switch, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface SwitchButtonProps {
	defaultValue: boolean;
	setStateValue: Dispatch<SetStateAction<boolean>>;
	size: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
	onLabel?: string;
	offLabel?: string;
}

// Ce bouton permet de récupérer la valeur par défaut fournie et de mettre à jour un state booléen du composant dans lequel il est intégré
export default function SwitchButton({
	defaultValue,
	setStateValue,
	onLabel,
	offLabel,
	size,
}: SwitchButtonProps) {
	// State interne au bouton permettant de changer son style
	const [checked, setChecked] = useState(defaultValue);

	// Le state est du parent est initialisé via le booléen fourni
	useEffect(() => {
		setStateValue(defaultValue);
	}, [defaultValue, setStateValue]);

	return (
		<Switch
			checked={checked}
			onChange={() => {
				setChecked((value) => !value);
				setStateValue((value) => !value);
			}}
			color='blue'
			size={size}
			thumbIcon={
				checked ? (
					<IconCheck
						style={{
							width: rem(12),
							height: rem(12),
						}}
						stroke={3}
						color='blue'
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
			onLabel={onLabel}
			offLabel={offLabel}
		/>
	);
}
