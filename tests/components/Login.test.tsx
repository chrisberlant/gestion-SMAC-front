import { render, screen, waitFor } from '@tests-utils';
import Login from '@components/Login/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { apiUrl } from '../mockHandlers';
import { http, HttpResponse } from 'msw';
import { mockServer } from '../setup';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

describe('Login', () => {
	it('should render the login form if user is not logged in', async () => {
		mockServer.use(
			http.get(apiUrl + '/me', () =>
				HttpResponse.json(null, { status: 401 })
			)
		);

		render(
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Login />
				</BrowserRouter>
			</QueryClientProvider>
		);

		await waitFor(() =>
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
		);
		expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /connexion/i })
		).toBeInTheDocument();
	});

	it('should redirect to the lines page if user is already logged in', async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Login />
				</BrowserRouter>
			</QueryClientProvider>
		);

		await waitFor(() => {
			expect(window.location.pathname).toBe('/lines');
		});
	});
});
