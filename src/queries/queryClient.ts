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
			// S'il s'agit d'un problème de token
			if (error.message.toLowerCase().includes('token')) {
				// Redirection vers l'index si problème de token
				localStorage.removeItem('smac_token');
				return (window.location.href = '/');
			}
			// S'il s'agit de la vérification du statut de connexion
			if (query.meta?.loginStatusQuery) return true;
			// Dans tous les autres cas, notification contenant le message d'erreur
			toast.error(error.message);
		},
		onSuccess: () => {},
	}),

	mutationCache: new MutationCache({
		onError: (error, _, __, mutation) => {
			// Si serveur injoignable
			if (error.message === 'Failed to fetch') {
				return toast.error('Impossible de joindre le serveur');
			}
			// S'il s'agit d'un problème de token
			if (error.message.toLowerCase().includes('token')) {
				// Redirection vers l'index si problème de token
				localStorage.removeItem('smac_token');
				return (window.location.href = '/');
			}
			// Si erreur lors de l'import, pas de message d'erreur
			if (mutation.options.meta?.importAgentsMutation) return true;
			toast.error(error.message);
		},
	}),
});

export default queryClient;
