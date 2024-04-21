import { render, screen, waitFor } from '@tests-utils';
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

		await waitFor(() =>
			expect(
				screen.getByText(/apple/i, {
					selector: 'td',
				})
			).toBeInTheDocument()
		);

		expect(
			screen.getByText(/samsung/i, {
				selector: 'td',
			})
		).toBeInTheDocument();
		expect(
			screen.getByText(/iphone 15/i, {
				selector: 'td',
			})
		).toBeInTheDocument();
		expect(
			screen.getByText(/s24/i, {
				selector: 'td',
			})
		).toBeInTheDocument();
		expect(
			screen.getByText(/256gb/i, {
				selector: 'td',
			})
		).toBeInTheDocument();
	});
});
