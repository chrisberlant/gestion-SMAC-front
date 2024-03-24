import { useEffect, useState } from 'react';
import { DateInput, DateValue } from '@mantine/dates';
import { dateUsFormatting } from '@/utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

interface DateChoiceProps {
	defaultValue: string;
	dateRef: React.MutableRefObject<string | null>;
}

export default function DateChoice({ defaultValue, dateRef }: DateChoiceProps) {
	// Valeur utilisée au format date dans le calendrier
	const [value, setValue] = useState<DateValue | null>(
		defaultValue ? new Date(defaultValue) : null
	);

	useEffect(() => {
		// Valeur utilisée au format string dans la ref du composant parent
		if (!value) dateRef.current = '';
		else dateRef.current = dateUsFormatting(value.toISOString());
	}, [dateRef, value]);

	return (
		<DateInput
			valueFormat='DD/MM/YYYY'
			clearable
			placeholder='Date'
			value={value}
			onChange={(e) => {
				setValue(e);
			}}
		/>
	);
}
