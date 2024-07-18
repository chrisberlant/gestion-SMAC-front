import { useState } from 'react';
import { DateInput, DateValue } from '@mantine/dates';
import { dateUsFormatting } from '@/utils';

interface DateChoiceProps {
	defaultValue?: string;
	dateRef: React.MutableRefObject<string | null>;
}

export default function DateChoice({ defaultValue, dateRef }: DateChoiceProps) {
	// Valeur utilisée au format date dans le calendrier
	const [value, setValue] = useState<DateValue | null>(
		defaultValue ? new Date(defaultValue) : null
	);
	dateRef.current = value ? dateUsFormatting(value.toISOString()) : null;

	return (
		<DateInput
			valueFormat='DD/MM/YYYY'
			clearable
			placeholder='Date'
			value={value}
			onChange={setValue}
		/>
	);
}
