type MethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// Fonction utilisée pour fetch les données depuis l'API en simplifiant la syntaxe
export default async function fetchApi(
	route: string,
	method?: MethodType,
	infos?: object
) {
	const baseUrl = import.meta.env.VITE_API_URL;
	const tokenAuthorization = `Bearer ${localStorage
		.getItem('smac_token')
		?.replace(/^"(.*)"$/, '$1')}`;

	const options: RequestInit = {
		method,
		headers: {
			authorization: tokenAuthorization,
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	};
	if (method && method !== 'GET') {
		if (!infos)
			throw new Error(
				"Les informations n'ont pas été fournies dans la requête"
			);
		options.body = JSON.stringify(infos); // Ajouter un body si la méthode est fournie et différente de GET
	}

	const response = await fetch(baseUrl + route, options);

	// Vérifier si la réponse contient une pièce jointe
	const contentDisposition = response.headers.get('content-disposition');
	if (contentDisposition && contentDisposition.includes('attachment')) {
		// Nom par défaut si les en-têtes renvoyés par l'API ne contiennent pas le nom du document
		let fileName = `export_${Date.now()}.csv`;
		const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		const matches = filenameRegex.exec(contentDisposition);
		if (matches && matches[1]) {
			// Association du nom s'il est envoyé par l'API
			fileName = matches[1].replace(/['"]/g, '');
		}
		// Lancer le téléchargement
		const blob = await response.blob();
		const url = window.URL.createObjectURL(new Blob([blob]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		link.click();
		return true;
	}

	// Si pas de pièce jointe, conversion en json
	const data = await response.json();

	// Si la requête a échoué
	if (!response.ok) {
		throw new Error(data);
	}

	return data;
}
