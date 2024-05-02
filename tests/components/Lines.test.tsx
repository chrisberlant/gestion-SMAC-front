import { render, screen, within } from '@tests-utils';
import Lines from '@components/Lines/Lines';
import { mockVirtualizedTable } from '../setup';

describe('Lines', () => {
	it('should render the lines table title', () => {
		render(<Lines />);

		expect(
			screen.getByRole('heading', { name: /lignes/i })
		).toBeInTheDocument();
	});

	it('should render the first and second lines in table rows', async () => {
		render(<Lines />);
		mockVirtualizedTable();

		const table = await screen.findByRole('table');
		[
			'0123456789',
			'VD',
			'Active',
			'Smith John - second-service',
			'134321456654877 - Samsung S24',
			'commentaire ligne 1',
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
