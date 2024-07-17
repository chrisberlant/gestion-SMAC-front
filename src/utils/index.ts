import dayjs from 'dayjs';
import { toPng } from 'html-to-image';
import Papa from 'papaparse';
import { RefObject } from 'react';

// Envoi d'email
export const sendEmail = ({
	sendTo,
	subject,
	content,
}: {
	sendTo: string;
	subject: string;
	content: string;
}) => {
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

// Utilisé pour les appels API de mise à jour, comparaison entre deux objets pour récupérer
// uniquement l'id et les valeurs qui ont changé, retourne un nouvel objet
export const getModifiedValues = <
	T extends Record<string, string | number | boolean | object | null>
>(
	originalData: T,
	newData: Partial<T>
) => {
	const newOptimizedData: Partial<T> = { ...newData };
	Object.entries(newData).forEach(([key, value]) => {
		if (
			Object.prototype.hasOwnProperty.call(originalData, key) &&
			originalData[key] === value &&
			key !== 'id'
		) {
			delete newOptimizedData[key];
		}
	});
	return newOptimizedData;
};

// Vérifier si une string est au format JSON, utilisée dans certains cas pour tester le retour de l'API
export const isJson = (string: string) => {
	try {
		JSON.parse(string);
		return true;
	} catch (error) {
		return false;
	}
};

// Export d'images au format PNG
export const exportToImage = (title: string, ref: RefObject<HTMLElement>) => {
	if (ref.current === null) return;

	toPng(ref.current, { cacheBust: false })
		.then((dataUrl) => {
			const link = document.createElement('a');
			link.download = `${title}_${Date.now()}.png`;
			link.href = dataUrl;
			link.click();
		})
		.catch((err) => {
			console.log(err);
		});
};
