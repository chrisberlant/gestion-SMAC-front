import { render, screen, waitFor } from '@tests-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { mockServer, testQueryClient } from '../setup';
import AdminDashboard from '../../src/components/AdminDashboard/AdminDashboard';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { apiUrl } from '../mockHandlers';

describe('Admin dashboard', () => {
	it('should render the admin tables titles if current user is admin', async () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<BrowserRouter>
					<AdminDashboard />
				</BrowserRouter>
			</QueryClientProvider>
		);

		await waitFor(() => {
			expect(
				screen.getByRole('heading', { name: /utilisateurs/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole('heading', { name: /services/i })
			).toBeInTheDocument();
			expect(
				screen.getByRole('heading', { name: /modèles/i })
			).toBeInTheDocument();
		});
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

		render(
			<QueryClientProvider client={testQueryClient}>
				<BrowserRouter>
					<AdminDashboard />
				</BrowserRouter>
			</QueryClientProvider>
		);

		await waitFor(() => {
			expect(window.location.pathname).toBe('/');
		});
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

		render(
			<QueryClientProvider client={testQueryClient}>
				<BrowserRouter>
					<AdminDashboard />
				</BrowserRouter>
			</QueryClientProvider>
		);

		await waitFor(() => {
			expect(window.location.pathname).toBe('/');
		});
	});
});
