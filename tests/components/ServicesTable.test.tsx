import { render, screen, waitFor } from '@tests-utils';
import ServicesTable from '@components/AdminDashboard/ServicesTable/ServicesTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

describe('Devices', () => {
	it('should render the services table title', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<ServicesTable />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /services/i })
		).toBeInTheDocument();
	});

	it('should render the first and second services in table rows', async () => {
		render(
			<QueryClientProvider client={queryClient}>
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
