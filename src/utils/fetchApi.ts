import { LineType, ModelType, ServiceType, UserType } from '../types';
import { AgentType } from '../types/agent';
import { DeviceType } from '../types/device';

// Types autorisés dans la méthode
type FetchType =
	| Record<string, string | number>
	| ServiceType
	| ModelType
	| UserType
	| LineType
	| AgentType
	| DeviceType;

type MethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

async function fetchApi(route: string, method?: MethodType, infos?: any) {
	const baseUrl = import.meta.env.VITE_API_URL;
	const options: RequestInit = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
	};
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
