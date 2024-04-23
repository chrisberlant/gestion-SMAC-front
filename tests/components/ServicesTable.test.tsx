import { render, screen, within } from '@tests-utils';
import ServicesTable from '@components/AdminDashboard/ServicesTable/ServicesTable';

describe('Devices', () => {
	it('should render the services table title', () => {
		render(<ServicesTable />);

		expect(
			screen.getByRole('heading', { name: /services/i })
		).toBeInTheDocument();
	});

	it('should render the first and second services in table rows', async () => {
		render(<ServicesTable />);

		const table = await screen.findByRole('table');
		within(table).getByText(/first-service/i);
		within(table).getByText(/second-service/i);
	});
});
