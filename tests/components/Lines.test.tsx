import { render, screen } from '@tests-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { testQueryClient } from '../setup';
import Lines from '@components/Lines/Lines';

describe('Lines', () => {
	it('should render the lines table title', () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<Lines />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /lignes/i })
		).toBeInTheDocument();
	});
});
