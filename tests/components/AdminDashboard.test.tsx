import { screen, waitFor } from '@tests-utils';
import { mockServer } from '../setup';
import AdminDashboard from '../../src/components/AdminDashboard/AdminDashboard';

import { http, HttpResponse } from 'msw';
import { apiUrl } from '../mockHandlers';
import { renderWithRouter } from '../utils/render';

describe('Admin dashboard', () => {
	it('should render the admin tables titles if current user is admin', async () => {
		renderWithRouter(<AdminDashboard />);

		await screen.findByRole('heading', { name: /utilisateurs/i });
		await screen.findByRole('heading', { name: /services/i });
		await screen.findByRole('heading', { name: /modèles/i });
	});

	it('should redirect to the home page if user is tech', async () => {
		mockServer.use(
			http.get(apiUrl + '/me', () =>
				HttpResponse.json(
					{
						email: 'chuck.norris@gmail.com',
						firstName: 'Chuck',
						lastName: 'Norris',
						role: 'Tech',
					},

					{ status: 200 }
				)
			)
		);

		renderWithRouter(<AdminDashboard />);

		await waitFor(() => expect(window.location.pathname).toBe('/'));
	});

	it('should redirect to the home page if user is consultant', async () => {
		mockServer.use(
			http.get(apiUrl + '/me', () =>
				HttpResponse.json(
					{
						email: 'chuck.norris@gmail.com',
						firstName: 'Chuck',
						lastName: 'Norris',
						role: 'Consultant',
					},

					{ status: 200 }
				)
			)
		);

		renderWithRouter(<AdminDashboard />);

		await waitFor(() => expect(window.location.pathname).toBe('/'));
	});
});
