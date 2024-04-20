import { render, screen } from '@tests-utils';
import Devices from '@components/Devices/Devices';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('Devices', () => {
	it('should render the devices table title', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<Devices />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: /appareils/i })
		).toBeInTheDocument();
	});
});