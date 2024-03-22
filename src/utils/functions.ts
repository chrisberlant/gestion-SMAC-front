import dayjs from 'dayjs';
import Papa from 'papaparse';

export const sendEmail = (sendTo: string, subject: string, content: string) => {
	const emailSubject = encodeURIComponent(subject);
	const emailContent = encodeURIComponent(content);

	const mailtoLink = `mailto:${sendTo}?subject=${emailSubject}&body=${emailContent}`;
	window.location.href = mailtoLink;
};

export const dateFrFormatting = (dateString: string | undefined) => {
	return dateString ? dayjs(dateString).format('DD/MM/YYYY') : '';
};

export const dateUsFormatting = (dateString: string | undefined) => {
	return dateString ? dayjs(dateString).format('YYYY-MM-DD') : '';
};

// Conversion d'un fichier CSV en json en ignorant les lignes vides
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
