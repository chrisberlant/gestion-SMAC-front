import { render, screen } from '@tests-utils';
import Devices from '@components/Devices/Devices';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@queries/queryClient';

describe('Devices', () => {
	render(
		<QueryClientProvider client={queryClient}>
			<Devices />
		</QueryClientProvider>
	);
	it('should render the devices table title', () => {
		expect(
			screen.getByRole('heading', { name: 'Liste des appareils' })
		).toBeInTheDocument();
	});
});
