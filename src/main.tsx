import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import queryClient from './queries/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DatesProvider } from '@mantine/dates';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme='light'>
				<ModalsProvider>
					<DatesProvider settings={{ locale: 'fr' }}>
						<App />
					</DatesProvider>
				</ModalsProvider>
			</MantineProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>
);
