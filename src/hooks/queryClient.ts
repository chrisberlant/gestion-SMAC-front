import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Gestion du comportement par défaut des requêtes
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
		},
	},

	queryCache: new QueryCache({
		onError: (error, query) => {
			// Si serveur injoignable
			if (error.message === 'Failed to fetch')
				return toast.error('Impossible de joindre le serveur');
			// Si vérification du statut de l'authentification sur la page de connexion
			if (query.meta?.loginPage) return;
			if (error.message.toLowerCase().includes('token')) {
				// Redirection vers l'index si problème de token
				localStorage.removeItem('smac_token');
				return (window.location.href = '/');
			}
			// Dans tous les autres cas, toast d'erreur
			toast.error(error.message);
		},
	}),

	mutationCache: new MutationCache({
		onError: (error, _, __, mutation) => {
			// Si serveur injoignable
			if (error.message === 'Failed to fetch')
				return toast.error('Impossible de joindre le serveur');
			// Si problème de token
			if (error.message.toLowerCase().includes('token')) {
				localStorage.removeItem('smac_token');
				return (window.location.href = '/');
			}
			// Si erreur lors de l'import, pas de toast d'erreur
			if (mutation.options.meta?.importMutation) return;
			toast.error(error.message);
		},
	}),
});

export default queryClient;
