import { Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

interface SwitchButtonProps {
	defaultValue: boolean;
	valueRef: React.MutableRefObject<boolean>;
	size: 'lg' | 'md' | 'sm' | 'xl' | 'xs';
	onLabel?: string;
	offLabel?: string;
}

// Ce bouton permet de récupérer la valeur par défaut fournie et de mettre à jour une ref booléen du composant dans lequel il est intégré
export default function SwitchButton({
	defaultValue,
	valueRef,
	onLabel,
	offLabel,
	size,
}: SwitchButtonProps) {
	// State interne au bouton permettant de changer son style
	const [checked, setChecked] = useState(defaultValue);
	// La ref du parent est initialisée et modifiée par le state interne au composant
	valueRef.current = checked;

	return (
		<Switch
			checked={checked}
			onChange={() => setChecked((prev) => !prev)}
			color='blue'
			size={size}
			thumbIcon={
				checked ? (
					<IconCheck size={12} stroke={3} color='blue' />
				) : (
					<IconX size={12} color='red' stroke={3} />
				)
			}
			onLabel={onLabel}
			offLabel={offLabel}
		/>
	);
}
