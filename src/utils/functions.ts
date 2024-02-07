import dayjs from 'dayjs';

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
