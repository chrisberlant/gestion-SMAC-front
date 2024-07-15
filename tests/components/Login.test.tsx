import { screen, waitFor } from '@tests-utils';
import Login from '@/components/Login/Login';
import { apiUrl } from '../mockHandlers';
import { http, HttpResponse } from 'msw';
import { mockServer } from '../setup';
import { renderWithRouter } from '../utils/render';

describe('Login', () => {
	it('should redirect to the lines page if user is already logged in', async () => {
		renderWithRouter(<Login />);

		await waitFor(() => expect(window.location.pathname).toBe('/lines'));
	});

	it('should render the login form if user is not logged in', async () => {
		mockServer.use(
			http.get(apiUrl + '/me', () =>
				HttpResponse.json(null, { status: 401 })
			)
		);

		renderWithRouter(<Login />);

		await screen.findByLabelText(/email/i);

		expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
		const button = screen.getByRole('button');
		expect(button.getAttribute('type') === 'submit').toBeTruthy();
	});
});
