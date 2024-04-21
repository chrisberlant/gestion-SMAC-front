import { render, screen, waitFor } from '@tests-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { testQueryClient } from '../setup';
import UsersTable from '@components/AdminDashboard/UsersTable/UsersTable';
import { expect } from 'vitest';

describe('Users', () => {
	it('should render the users table title', () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<UsersTable />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /utilisateurs/i })
		).toBeInTheDocument();
	});

	it('should render the first and second users in table rows', async () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<UsersTable />
			</QueryClientProvider>
		);

		await waitFor(() =>
			expect(
				screen.getByText('super.administrator@gmail.com', {
					selector: 'td',
				})
			).toBeInTheDocument()
		);
		['Super', 'Administrator', 'Admin'].map((value) =>
			expect(screen.getByText(value)).toBeInTheDocument()
		);
		['chuck.norris@gmail.com', 'Chuck', 'Norris', 'Tech'].map((value) =>
			expect(screen.getByText(value)).toBeInTheDocument()
		);
	});
});
