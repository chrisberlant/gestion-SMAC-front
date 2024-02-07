type MethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function fetchApi(route: string, method?: MethodType, infos?: object) {
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
	console.log(tokenAuthorization);
	if (method && method !== 'GET') {
		if (!infos)
			throw new Error(
				"Les informations n'ont pas été fournies dans la requête"
			);
		options.body = JSON.stringify(infos); // Add a body if method is provided and it is not equal to GET
	}

	const response = await fetch(baseUrl + route, options);
	const data = await response.json();

	// If request failed
	if (!response.ok) {
		throw new Error(data);
	}

	return data;
}

export default fetchApi;
