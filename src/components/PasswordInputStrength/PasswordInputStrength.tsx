import {
	Box,
	Progress,
	PasswordInput,
	Group,
	Text,
	Center,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';

function PasswordRequirement({
	meets,
	label,
}: {
	meets: boolean;
	label: string;
}) {
	return (
		<Text component='div' c={meets ? 'teal' : 'red'} mt={5} size='sm'>
			<Center inline>
				{meets ? (
					<IconCheck size='0.9rem' stroke={1.5} />
				) : (
					<IconX size='0.9rem' stroke={1.5} />
				)}
				<Box ml={7}>{label}</Box>
			</Center>
		</Text>
	);
}

const requirements = [
	{ regex: /[0-9]/, label: 'Possède au moins un nombre' },
	{ regex: /[a-z]/, label: 'Possède au moins une minuscule' },
	{ regex: /[A-Z]/, label: 'Possède au moins une majuscule' },
	{
		regex: /[$&+,:;=?@#|'<>.^*()%!_-]/,
		label: 'Possède au moins un caractère spécial',
	},
];

function getStrength(password: string) {
	let multiplier = password.length > 7 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.regex.test(password)) multiplier += 1;
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

interface PasswordInputStrengthProps<T> {
	form: UseFormReturnType<T>;
	field: keyof T;
}

export function PasswordInputStrength<T>({
	form,
	field,
}: PasswordInputStrengthProps<T>) {
	const value = form.values[field] as string;
	const strength = getStrength(value);
	const checks = requirements.map((requirement, index) => (
		<PasswordRequirement
			key={index}
			label={requirement.label}
			meets={requirement.regex.test(value)}
		/>
	));
	const bars = Array(4)
		.fill(0)
		.map((_, index) => (
			<Progress
				styles={{ section: { transitionDuration: '0ms' } }}
				value={
					value.length > 0 && index === 0
						? 100
						: strength >= ((index + 1) / 4) * 100
						? 100
						: 0
				}
				color={
					strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'
				}
				key={index}
				size={4}
			/>
		));

	return (
		<div>
			<PasswordInput
				label='Nouveau mot de passe'
				placeholder='Votre nouveau mot de passe'
				{...form.getInputProps(field)}
				labelProps={{ mb: '4' }}
				mb='xs'
			/>

			<Group gap={5} grow mt='xs' mb='xs'>
				{bars}
			</Group>

			<PasswordRequirement
				label='Possède au moins 8 caractères'
				meets={value.length > 7}
			/>
			{checks}
		</div>
	);
}
