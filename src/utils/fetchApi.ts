import { LineType, ModelType, ServiceType, UserType } from '../types';

// Types autorisés dans la méthode
type FetchType =
	| Record<string, string | number>
	| ServiceType
	| ModelType
	| UserType
	| LineType;

async function fetchApi(route: string, method?: string, infos?: FetchType) {
	const baseUrl = import.meta.env.VITE_API_URL;
	const options: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	};
	if (method && method !== 'GET') {
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
