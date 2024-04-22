import { render, screen, waitFor } from '@tests-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { mockServer, testQueryClient } from '../setup';
import EditDeleteButtons from '@components/TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import { expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { apiUrl } from '../mockHandlers';

describe('Edit & delete buttons', () => {
	it('should render the buttons if current user is admin', async () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<EditDeleteButtons
					editFunction={() => null}
					deleteFunction={() => null}
				/>
			</QueryClientProvider>
		);

		await waitFor(() => {
			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBe(2);
			buttons.forEach((button) => {
				expect(button).toBeEnabled();
			});
		});
	});

	it('should render the buttons if current user is tech', async () => {
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
				<EditDeleteButtons
					editFunction={() => null}
					deleteFunction={() => null}
				/>
			</QueryClientProvider>
		);

		await waitFor(() => {
			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBe(2);
			buttons.forEach((button) => {
				expect(button).toBeEnabled();
			});
		});
	});

	it('should render the disabled buttons if current user is consultant', async () => {
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
				<EditDeleteButtons
					editFunction={() => null}
					deleteFunction={() => null}
				/>
			</QueryClientProvider>
		);

		await waitFor(() => {
			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBe(2);
			buttons.forEach((button) => {
				expect(button).toBeDisabled();
			});
		});
	});
});
