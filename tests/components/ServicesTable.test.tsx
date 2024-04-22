import { render, screen, within } from '@tests-utils';
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

		const table = await screen.findByRole('table');
		within(table).getByText(/first-service/i);
		within(table).getByText(/second-service/i);
	});
});
