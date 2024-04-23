import { render, screen } from '@tests-utils';
import Devices from '@components/Devices/Devices';

describe('Devices', () => {
	it('should render the devices table title', () => {
		render(<Devices />);

		expect(
			screen.getByRole('heading', { name: /appareils/i })
		).toBeInTheDocument();
	});
	// TODO
	// it('should render the first and second devices IMEI in table rows', async () => {
	// 	render(
	// 			<Devices />
	// 	);

	// 	await waitFor(() =>
	// 		expect(screen.getByText('123321456654780')).toBeInTheDocument()
	// 	);
	// 	expect(screen.getByText('134321456654877')).toBeInTheDocument();
	// });
});
