import { render, screen } from '@tests-utils';
import Lines from '@components/Lines/Lines';

describe('Lines', () => {
	it('should render the lines table title', () => {
		render(<Lines />);

		expect(
			screen.getByRole('heading', { name: /lignes/i })
		).toBeInTheDocument();
	});
});
