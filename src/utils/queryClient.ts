import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (!query.meta?.loginStatusQuery) {
				// Erreur générée uniquement s'il ne s'agit pas de la vérification du token sur la page de connexion
				toast.error(error.message);
				if (error.message.toLowerCase().includes('token')) {
					// Redirection vers l'index si problème de token
					window.location.href = '/';
				}
			}
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			toast.error(error.message);
			if (error.message.toLowerCase().includes('token')) {
				// Redirection vers l'index si problème de token
				window.location.href = '/';
			}
		},
	}),
});

export default queryClient;
