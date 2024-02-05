export const sendEmail = (sendTo: string, subject: string, content: string) => {
	const emailSubject = encodeURIComponent(subject);
	const emailContent = encodeURIComponent(content);

	const mailtoLink = `mailto:${sendTo}?subject=${emailSubject}&body=${emailContent}`;
	window.location.href = mailtoLink;
};

export const dateFormatting = (dateString: string) => {
	// if (!dateString) return '';
	const [year, month, day] = dateString.split('-');

	return `${day}/${month}/${year}`;
};
