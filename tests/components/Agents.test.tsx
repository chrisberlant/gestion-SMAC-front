import { render, screen, within } from '@tests-utils';
import Agents from '@components/Agents/Agents';
import { mockVirtualizedTable } from '../setup';

describe('Agents', () => {
	it('should render the agents table title and loader while loading', () => {
		const { container } = render(<Agents />);

		expect(
			screen.getByRole('heading', { name: /agents/i })
		).toBeInTheDocument();
		expect(
			container.getElementsByClassName('loading')[0]
		).toBeInTheDocument();
	});

	it('should render the first and second agents in table rows', async () => {
		render(<Agents />);
		mockVirtualizedTable();

		const table = await screen.findByRole('table');
		['john.smith@gmail.com', 'Smith', 'John', 'Non', 'second-service'].map(
			(value) => within(table).getByText(value)
		);
		[
			'karen.taylor@gmail.com',
			'Taylor',
			'Karen',
			'Oui',
			'first-service',
		].map((value) => within(table).getByText(value));
	});
});
