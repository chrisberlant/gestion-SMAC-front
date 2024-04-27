import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mockHandlers';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
window.HTMLElement.prototype.scrollIntoView = () => {};

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

window.ResizeObserver = ResizeObserver;

export const mockVirtualizedTable = () =>
	(window.Element.prototype.getBoundingClientRect = vitest
		.fn()
		.mockReturnValue({ height: 1000, width: 1000 }));

export const mockServer = setupServer(...handlers);

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }));
afterAll(() => mockServer.close());
afterEach(() => mockServer.resetHandlers());
