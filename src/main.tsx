import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { toast } from 'sonner';

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (!query.meta?.loginStatusQuery) {
				// Erreur générée uniquement s'il ne s'agit pas de la vérification du token
				toast.error(error.message);
				if (error.message.toLowerCase().includes('token')) {
					window.location.href = '/';
				}
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			toast.error(error.message);
			if (error.message.toLowerCase().includes('token')) {
				window.location.href = '/';
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
