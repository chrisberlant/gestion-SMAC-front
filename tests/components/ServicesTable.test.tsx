import { render, screen } from '@tests-utils';
import ServicesTable from '@components/AdminDashboard/ServicesTable/ServicesTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('Devices', () => {
	it('should render the devices table title', async () => {
		render(
			<QueryClientProvider client={queryClient}>
				<ServicesTable />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /services/i })
		).toBeInTheDocument();
	});
});
