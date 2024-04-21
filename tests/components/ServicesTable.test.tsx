import { render, screen, waitFor } from '@tests-utils';
import ServicesTable from '@components/AdminDashboard/ServicesTable/ServicesTable';
import { QueryClientProvider } from '@tanstack/react-query';
import { testQueryClient } from '../setup';

describe('Devices', () => {
	it('should render the services table title', () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<ServicesTable />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /services/i })
		).toBeInTheDocument();
	});

	it('should render the first and second services in table rows', async () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<ServicesTable />
			</QueryClientProvider>
		);

		await waitFor(() =>
			expect(
				screen.getByText(/first-service/i, {
					selector: 'td',
				})
			).toBeInTheDocument()
		);
		expect(
			screen.getByText(/second-service/i, {
				selector: 'td',
			})
		).toBeInTheDocument();
	});
});
