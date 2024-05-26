import {
	renderWithRouter,
	screen,
	userEvent,
	within,
	renderWithRouterAndVirtualization,
} from '@tests-utils';
import Devices from '@components/Devices/Devices';

describe('Devices', () => {
	it('should render the devices table title while loading', () => {
		const { container } = renderWithRouter(<Devices />);

		expect(
			screen.getByRole('heading', { name: /appareils/i })
		).toBeInTheDocument();
		expect(
			container.getElementsByClassName('loading')[0]
		).toBeInTheDocument();
	});

	it('should render the first and second devices in table rows', async () => {
		renderWithRouterAndVirtualization(<Devices />);

		const table = await screen.findByRole('table');
		await within(table).findByText('123321456654780');
		[
			'En stock',
			'Neuf',
			'Apple iPhone 15 256GB',
			'Taylor Karen - first-service',
		].map((value) => within(table).getByText(value));
		[
			'134321456654877',
			'Attribué',
			'Occasion',
			'Samsung S24',
			'Smith John - second-service',
			'07/01/2023',
			'22/01/2023',
			'commentaire appareil 2',
		].map((value) => within(table).getByText(value));
	});

	it('should render the list of agents when user is editing a row and clicking on the agents list', async () => {
		renderWithRouterAndVirtualization(<Devices />);

		const user = userEvent.setup();

		const editButtons = await screen.findAllByLabelText('Modifier');
		const firstEditButton = editButtons[0];
		await user.click(firstEditButton);

		const selectAgentElement = screen.getByPlaceholderText(
			/^(?!.*[Ff]ilter).*propriétaire/i
		);
		// const selectAgentElement = screen.getByRole('textbox', {
		// 	name: 'Propriétaire',
		// });
		expect(selectAgentElement).toBeInTheDocument();
		await user.click(selectAgentElement);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
		expect(options[0]).toHaveTextContent('Smith John - second-service');
		expect(options[1]).toHaveTextContent('Taylor Karen - first-service');
	});

	it('should render the list of models when user is editing a row and clicking on the models list', async () => {
		renderWithRouterAndVirtualization(<Devices />);

		const user = userEvent.setup();

		const editButtons = await screen.findAllByLabelText('Modifier');
		const firstEditButton = editButtons[0];
		await user.click(firstEditButton);

		const selectModelElement = screen.getByPlaceholderText(
			/^(?!.*[Ff]ilter).*modèle/i
		);
		expect(selectModelElement).toBeInTheDocument();
		await user.click(selectModelElement);

		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
		expect(options[0]).toHaveTextContent('Apple iPhone 15 256GB');
		expect(options[1]).toHaveTextContent('Samsung S24');
	});
});
