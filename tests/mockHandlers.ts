import { http, HttpResponse } from 'msw';

const apiUrl = process.env.VITE_API_URL;

const handlers = [
	http.get(`${apiUrl}/services`, () =>
		HttpResponse.json(
			[
				{ id: '1', title: 'first-service' },
				{ id: '2', title: 'second-service' },
			],
			{ status: 200 }
		)
	),
];

export default handlers;
