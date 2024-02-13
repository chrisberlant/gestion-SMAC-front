import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DateInput, DateValue } from '@mantine/dates';
import { dateUsFormatting } from '../../utils/functions';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface DateChoiceProps {
	defaultValue: string | null;
	setStateValue: Dispatch<SetStateAction<string | null>>;
}

export default function DateChoice({
	defaultValue,
	setStateValue,
}: DateChoiceProps) {
	// Valeur utilisée au format date dans le calendrier
	const [value, setValue] = useState<DateValue | null>(
		defaultValue ? new Date(defaultValue) : null
	);

	useEffect(() => {
		// Valeur utilisée au format string dans le composant parent
		if (!defaultValue) return setStateValue(null);
		setStateValue(defaultValue);
	}, [defaultValue, setStateValue]);

	return (
		<DateInput
			valueFormat='DD/MM/YYYY'
			clearable
			placeholder='Date'
			value={value}
			onChange={(e) => {
				setValue(e);
				setStateValue(dateUsFormatting(e?.toISOString()));
			}}
		/>
	);
}
