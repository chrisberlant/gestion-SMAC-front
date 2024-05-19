import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import {
	MantineProvider,
	colorsTuple,
	createTheme,
	virtualColor,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import queryClient from '@queries/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DatesProvider } from '@mantine/dates';

const theme = createTheme({
	cursorType: 'pointer',
	colors: {
		passwordLight: colorsTuple('#DADADA'),
		passwordDark: colorsTuple('#464948'),
		passwordContainer: virtualColor({
			name: 'passwordContainer',
			dark: 'passwordDark',
			light: 'passwordLight',
		}),
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme='light' theme={theme}>
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
