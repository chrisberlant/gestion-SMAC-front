const baseUrl = 'http://localhost:3000';

async function fetchApi(
	route: string,
	method?: string,
	infos?: Record<string, string>
) {
	try {
		const options: RequestInit = {
			method,
			credentials: 'include', // Include the jwt cookie
		};
		if (method && method !== 'GET') {
			options.body = JSON.stringify(infos); // Add a body if method is provided and it is not equal to GET
		}

		const response = await fetch(baseUrl + route, options);
		const data = await response.json();

		// If request failed
		if (!response.ok) {
			// If the API replies with invalid token or non existent token
			if (data.toLowerCase().includes('token')) {
				window.location.href = '/login';
			}
			throw new Error(data);
		}
		return data;
	} catch (error) {
		return error;
	}
}

export default fetchApi;
