import { render, screen } from '@tests-utils';
import { mockServer } from '../setup';
import EditDeleteButtons from '@/components/TableActionsButtons/EditDeleteButtons/EditDeleteButtons';
import { expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { apiUrl } from '../mockHandlers';

describe('Edit & delete buttons', () => {
	it('should render the buttons if current user is admin', async () => {
		render(
			<EditDeleteButtons
				editFunction={() => null}
				deleteFunction={() => null}
			/>
		);

		const buttons = await screen.findAllByRole('button');

		expect(buttons).toHaveLength(2);
		buttons.forEach((button) => expect(button).toBeEnabled());
	});

	it('should render the buttons if current user is tech', async () => {
		mockServer.use(
			http.get(apiUrl + '/me', () =>
				HttpResponse.json(
					{
						email: 'chuck.norris@gmail.com',
						firstName: 'Chuck',
						lastName: 'Norris',
						role: 'Tech',
					},
					{ status: 200 }
				)
			)
		);

		render(
			<EditDeleteButtons
				editFunction={() => null}
				deleteFunction={() => null}
			/>
		);

		const buttons = await screen.findAllByRole('button');

		expect(buttons).toHaveLength(2);
		buttons.forEach((button) => expect(button).toBeEnabled());
	});

	it('should render the disabled buttons if current user is consultant', async () => {
		mockServer.use(
			http.get(apiUrl + '/me', () =>
				HttpResponse.json(
					{
						email: 'chuck.norris@gmail.com',
						firstName: 'Chuck',
						lastName: 'Norris',
						role: 'Consultant',
					},
					{ status: 200 }
				)
			)
		);

		render(
			<EditDeleteButtons
				editFunction={() => null}
				deleteFunction={() => null}
			/>
		);

		const buttons = await screen.findAllByRole('button');

		expect(buttons).toHaveLength(2);
		buttons.forEach((button) => expect(button).toBeDisabled());
	});
});
