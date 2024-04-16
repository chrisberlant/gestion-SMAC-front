import { render, screen } from '@tests-utils';
import { describe, it } from 'vitest';
import Devices from '@components/Devices/Devices';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@queries/queryClient';

describe('Devices', () => {
	it('should render the devices table title', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<Devices />
			</QueryClientProvider>
		);

		expect(
			screen.getByRole('heading', { name: 'Liste des appareils' })
		).toBeInTheDocument();
	});
});
