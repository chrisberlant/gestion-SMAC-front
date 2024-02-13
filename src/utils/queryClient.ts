import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},

	queryCache: new QueryCache({
		onError: (error, query) => {
			// Erreur générée uniquement s'il ne s'agit pas de la vérification du token sur la page de connexion
			if (!query.meta?.loginStatusQuery) {
				if (error.message === 'Failed to fetch') {
					return toast.error('Impossible de joindre le serveur');
				} else {
					toast.error(error.message);
					if (error.message.toLowerCase().includes('token')) {
						// Redirection vers l'index si problème de token
						localStorage.removeItem('smac_token');
						window.location.href = '/';
					}
				}
			}
		},
		onSuccess: () => {},
	}),

	mutationCache: new MutationCache({
		onError: (error) => {
			if (error.message === 'Failed to fetch') {
				toast.error('Impossible de joindre le serveur');
			} else {
				toast.error(error.message);
				if (error.message.toLowerCase().includes('token')) {
					// Redirection vers l'index si problème de token
					localStorage.removeItem('smac_token');
					window.location.href = '/';
				}
			}
		},
	}),
});

export default queryClient;
