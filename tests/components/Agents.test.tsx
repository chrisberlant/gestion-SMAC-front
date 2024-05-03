import { render, screen, userEvent, within } from '@tests-utils';
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
		await within(table).findByText('john.smith@gmail.com');
		['Smith', 'John', 'Non', 'second-service'].map((value) =>
			within(table).getByText(value)
		);
		[
			'karen.taylor@gmail.com',
			'Taylor',
			'Karen',
			'Oui',
			'first-service',
		].map((value) => within(table).getByText(value));
	});

	it('should render the list of services when user is editing a row and clicking on the services list', async () => {
		render(<Agents />);
		mockVirtualizedTable();

		const user = userEvent.setup();

		const editButtons = await screen.findAllByLabelText('Modifier');
		const firstEditButton = editButtons[0];
		await user.click(firstEditButton);

		const selectServiceElement = screen.getByPlaceholderText(
			/^(?!.*[Ff]ilter).*service/i
		);
		expect(selectServiceElement).toBeInTheDocument();
		await user.click(selectServiceElement);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
		expect(options[0]).toHaveTextContent('first-service');
		expect(options[1]).toHaveTextContent('second-service');
	});
});
