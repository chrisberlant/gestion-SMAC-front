import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DateInput, DateValue } from '@mantine/dates';
import { dateUsFormatting } from '../../utils/functions';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface DateInputProps {
	defaultValue: string;
	setStateValue: Dispatch<SetStateAction<string>>;
}

export default function DateChoice({
	defaultValue,
	setStateValue,
}: DateInputProps) {
	// Valeur utilisée au format date dans le calendrier
	const [value, setValue] = useState<DateValue>(new Date(defaultValue));

	useEffect(() => {
		// Valeur utilisée au format string dans le composant parent
		setStateValue(defaultValue);
	}, [defaultValue, setStateValue]);

	return (
		<DateInput
			valueFormat='DD/MM/YYYY'
			placeholder={defaultValue}
			value={value}
			onChange={(e) => {
				setValue(e);
				setStateValue(dateUsFormatting(e?.toISOString()));
			}}
		/>
	);
}
