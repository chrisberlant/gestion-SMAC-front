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

// Comparaison entre deux objets pour savoir si le plus petit est inclus dans le plus gros
// Renvoie un booléen
export const objectIncludesObject = <
	T extends Record<string, string | number | boolean | object | null>
>(
	bigObject: T,
	smallObject: Partial<T>
) =>
	Object.entries(smallObject).every(
		([key, value]) =>
			Object.prototype.hasOwnProperty.call(bigObject, key) &&
			bigObject[key] === value
	);

// Utilisé pour les appels API de mise à jour, comparaison entre deux objets pour supprimer les valeurs identiques,
//permettant ensuited 'envoyer uniquement les données à modifier, retourne l'objet modifié
export const optimizeData = <
	T extends Record<string, string | number | boolean | object | null>
>(
	originalData: T,
	newData: Partial<T>
) => {
	const newOptimizedData: Partial<T> = { ...newData };
	Object.entries(newData).forEach(([key, value]) => {
		if (
			Object.prototype.hasOwnProperty.call(originalData, key) &&
			originalData[key] === value
		) {
			delete newOptimizedData[key];
		}
	});
	return newOptimizedData;
};
