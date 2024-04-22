import {
	getAllByRole,
	getByRole,
	render,
	screen,
	waitFor,
	within,
} from '@tests-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { testQueryClient } from '../setup';
import Agents from '@components/Agents/Agents';

describe('Agents', () => {
	it('should render the agents table title', () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<Agents />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /agents/i })
		).toBeInTheDocument();
	});

	it('should render the first and second agents in table rows', async () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<Agents />
			</QueryClientProvider>
		);

		await waitFor(() => {
			const table = screen.getByRole('table');
			[
				'john.smith@gmail.com',
				'Smith',
				'John',
				'Non',
				'second-service',
			].map((value) => within(table).getByText(value));
			[
				'karen.taylor@gmail.com',
				'Taylor',
				'Karen',
				'Oui',
				'first-service',
			].map((value) => within(table).getByText(value));
		});
	});
});
