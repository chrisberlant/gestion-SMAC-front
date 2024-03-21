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

export const parseCsvToJson = (
	file: string,
	callbackFn: (data: string) => void
) => {
	Papa.parse(file, {
		header: true,
		complete: () => callbackFn(file),
	});
};
