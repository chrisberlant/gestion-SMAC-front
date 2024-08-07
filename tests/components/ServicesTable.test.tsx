import {
	renderWithRouter,
	renderWithRouterAndVirtualization,
	screen,
	within,
} from '@tests-utils';
import ServicesTable from '@/components/AdminDashboard/ServicesTable/ServicesTable';

describe('Devices table', () => {
	it('should render the services table title while loading', () => {
		const { container } = renderWithRouter(<ServicesTable />);

		expect(
			screen.getByRole('heading', { name: /services/i })
		).toBeInTheDocument();
		expect(
			container.getElementsByClassName('loading')[0]
		).toBeInTheDocument();
	});

	it('should render the first and second services in table rows', async () => {
		renderWithRouterAndVirtualization(<ServicesTable />);

		const table = await screen.findByRole('table');
		await within(table).findByText(/first-service/i);
		within(table).getByText(/second-service/i);
	});
});
