import { render, screen, within } from '@tests-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { testQueryClient } from '../setup';
import ModelsTable from '../../src/components/AdminDashboard/ModelsTable/ModelsTable';

describe('Models', () => {
	it('should render the models table title', () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<ModelsTable />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /modèles/i })
		).toBeInTheDocument();
	});

	it('should render the first and second models in table rows', async () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<ModelsTable />
			</QueryClientProvider>
		);

		const table = await screen.findByRole('table');
		[/apple/i, /iphone 15/i, /256gb/i].map((value) =>
			within(table).getByText(value)
		);
		[/samsung/i, /s24/i].map((value) => within(table).getByText(value));
	});
});
