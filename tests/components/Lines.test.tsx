import { render, screen, within } from '@tests-utils';
import Lines from '@components/Lines/Lines';
import { mockVirtualizedTable } from '../setup';

describe('Lines', () => {
	it('should render the lines table title while loading', () => {
		const { container } = render(<Lines />);

		expect(
			screen.getByRole('heading', { name: /lignes/i })
		).toBeInTheDocument();
		expect(
			container.getElementsByClassName('loading')[0]
		).toBeInTheDocument();
	});

	it('should render the first and second lines in table rows', async () => {
		render(<Lines />);
		mockVirtualizedTable();

		const table = await screen.findByRole('table');
		await within(table).findByText('0123456789');
		[
			'VD',
			'Active',
			'Smith John - second-service',
			'commentaire ligne 1',
			'134321456654877 - Samsung S24',
		].map((value) => within(table).getByText(value));
		[
			'0987654321',
			'V',
			'Résiliée',
			'Taylor Karen - first-service',
			'123321456654780 - Apple iPhone 15 256GB',
		].map((value) => within(table).getByText(value));
	});
});
