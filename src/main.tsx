import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { toast } from 'sonner';

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(error.message);
			if (error.message.toLowerCase().includes('token')) {
				// window.location.href = '/login';
			}
		},
	}),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider defaultColorScheme='light'>
				<ModalsProvider>
					<App />
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	</React.StrictMode>
);
