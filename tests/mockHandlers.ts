import { http, HttpResponse } from 'msw';

export const apiUrl = process.env.VITE_API_URL;

export const handlers = [
	http.get(apiUrl + '/services', () =>
		HttpResponse.json(
			[
				{ id: '1', title: 'first-service' },
				{ id: '2', title: 'second-service' },
			],
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/me', () =>
		HttpResponse.json(
			[
				{
					email: 'chuck.norris@gmail.com',
					firstName: 'Chuck',
					lastName: 'Norris',
					role: 'Admin',
				},
			],
			{ status: 200 }
		)
	),
];
