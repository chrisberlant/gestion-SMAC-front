import { render, screen, within } from '@tests-utils';
import UsersTable from '@components/AdminDashboard/UsersTable/UsersTable';
import { expect } from 'vitest';

describe('Users table', () => {
	it('should render the users table title while loading', () => {
		const { container } = render(<UsersTable />);

		expect(
			screen.getByRole('heading', { name: /utilisateurs/i })
		).toBeInTheDocument();
		expect(
			container.getElementsByClassName('loading')[0]
		).toBeInTheDocument();
	});

	it('should render a table with the first and second users', async () => {
		render(<UsersTable />);

		const table = await screen.findByRole('table');
		[
			'super.administrator@gmail.com',
			/super/i,
			/administrator/i,
			/admin/i,
		].map((value) => within(table).getAllByText(value));
		['chuck.norris@gmail.com', /chuck/i, /norris/i, /tech/i].map((value) =>
			within(table).getAllByText(value)
		);
	});
});
