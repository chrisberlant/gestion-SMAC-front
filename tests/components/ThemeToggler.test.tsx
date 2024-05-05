import { render, screen, userEvent } from '@tests-utils';
import { describe, it } from 'vitest';
import ThemeToggler from '@components/ThemeToggler/ThemeToggler';

describe('Theme toggler', () => {
	it('should render the theme toggler with a button to switch to dark theme', () => {
		render(<ThemeToggler />);

		const button = screen.getByRole('button');

		expect(button).toHaveAttribute(
			'aria-label',
			expect.stringMatching('thème sombre')
		);
	});

	it('should change the button to switch to light theme if it has been clicked', async () => {
		render(<ThemeToggler />);

		const button = screen.getByRole('button');
		const user = userEvent.setup();
		await user.click(button);

		expect(button).toHaveAttribute(
			'aria-label',
			expect.stringMatching('thème clair')
		);
	});
});
