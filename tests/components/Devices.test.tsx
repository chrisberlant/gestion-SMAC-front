import { render, screen, waitFor } from '@tests-utils';
import Devices from '@components/Devices/Devices';
import { QueryClientProvider } from '@tanstack/react-query';
import { testQueryClient } from '../setup';

describe('Devices', () => {
	it('should render the devices table title', () => {
		render(
			<QueryClientProvider client={testQueryClient}>
				<Devices />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /appareils/i })
		).toBeInTheDocument();
	});
	// TODO
	// it('should render the first and second devices IMEI in table rows', async () => {
	// 	render(
	// 		<QueryClientProvider client={testQueryClient}>
	// 			<Devices />
	// 		</QueryClientProvider>
	// 	);

	// 	await waitFor(() =>
	// 		expect(screen.getByText('123321456654780')).toBeInTheDocument()
	// 	);
	// 	expect(screen.getByText('134321456654877')).toBeInTheDocument();
	// });
});
