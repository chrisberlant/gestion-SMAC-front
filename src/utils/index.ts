import dayjs from 'dayjs';
import Papa from 'papaparse';

// Envoi d'email
export const sendEmail = (sendTo: string, subject: string, content: string) => {
	const emailSubject = encodeURIComponent(subject);
	const emailContent = encodeURIComponent(content);

	const mailtoLink = `mailto:${sendTo}?subject=${emailSubject}&body=${emailContent}`;
	window.location.href = mailtoLink;
};

// Formatage des dates
export const dateFrFormatting = (dateString: string | undefined) =>
	dateString ? dayjs(dateString).format('DD/MM/YYYY') : '';

export const dateUsFormatting = (dateString: string | undefined) =>
	dateString ? dayjs(dateString).format('YYYY-MM-DD') : '';
export const dateTimeToStringFormatting = (dateToFormat: Date | undefined) =>
	dateToFormat ? dayjs(dateToFormat).format('DD/MM/YYYY - HH:mm') : '';

// Conversion d'un fichier CSV en json en ignorant les lignes vides, la fonction passée en callback est ensuite appelée
export const parseCsvToJson = (
	file: string,
	callbackFn: (data: object[]) => void
) => {
	Papa.parse(file, {
		header: true,
		skipEmptyLines: 'greedy',
		complete: (results) => callbackFn(results.data as object[]),
	});
};
