import { render, screen } from '@tests-utils';
import EditDeleteResetPasswordButtons from '../../src/components/TableActionsButtons/EditDeleteButtons/EditDeleteResetPasswordButtons';
import { expect } from 'vitest';

describe('Edit & delete buttons', () => {
	it('should render the buttons for rows displaying users different than current user and root user', async () => {
		render(
			<EditDeleteResetPasswordButtons
				editFunction={() => null}
				deleteFunction={() => null}
				resetPasswordFunction={() => null}
				rowEmail='david.miller@gmail.com'
				rowId={3}
			/>
		);

		const buttons = await screen.findAllByRole('button');

		expect(buttons.length).toBe(3);
		buttons.forEach((button) => expect(button).toBeEnabled());
	});

	it('should render the disabled buttons if the row displays the current user', async () => {
		render(
			<EditDeleteResetPasswordButtons
				editFunction={() => null}
				deleteFunction={() => null}
				resetPasswordFunction={() => null}
				rowEmail='chuck.norris@gmail.com'
				rowId={2}
			/>
		);

		const buttons = await screen.findAllByRole('button');

		expect(buttons.length).toBe(3);
		buttons.forEach((button) => expect(button).toBeDisabled());
	});

	it('should render the disabled buttons if the row displays the root user', async () => {
		render(
			<EditDeleteResetPasswordButtons
				editFunction={() => null}
				deleteFunction={() => null}
				resetPasswordFunction={() => null}
				rowEmail='david.miller@gmail.com'
				rowId={1}
			/>
		);

		const buttons = await screen.findAllByRole('button');

		expect(buttons.length).toBe(3);
		buttons.forEach((button) => expect(button).toBeDisabled());
	});
});
