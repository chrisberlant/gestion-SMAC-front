import { renderWithRouter, screen, within } from '@tests-utils';
import ModelsTable from '@components/AdminDashboard/ModelsTable/ModelsTable';

describe('Models table', () => {
	it('should render the models table title while loading', () => {
		const { container } = renderWithRouter(<ModelsTable />);

		expect(
			screen.getByRole('heading', { name: /modèles/i })
		).toBeInTheDocument();
		expect(
			container.getElementsByClassName('loading')[0]
		).toBeInTheDocument();
	});

	it('should render the first and second models in table rows', async () => {
		renderWithRouter(<ModelsTable />);

		const table = await screen.findByRole('table');
		[/apple/i, /iphone 15/i, /256gb/i].map((value) =>
			within(table).getByText(value)
		);
		[/samsung/i, /s24/i].map((value) => within(table).getByText(value));
	});
});
