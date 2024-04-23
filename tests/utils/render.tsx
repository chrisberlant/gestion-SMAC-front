import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

function Wrapper({ children }: { children: ReactNode }) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

export function render(ui: React.ReactNode) {
	return testingLibraryRender(<>{ui}</>, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<MantineProvider>
				<Wrapper>{children}</Wrapper>
			</MantineProvider>
		),
	});
}

export function renderWithRouter(ui: React.ReactNode) {
	return testingLibraryRender(<>{ui}</>, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<MantineProvider>
				<Wrapper>
					<BrowserRouter>{children}</BrowserRouter>
				</Wrapper>
			</MantineProvider>
		),
	});
}
