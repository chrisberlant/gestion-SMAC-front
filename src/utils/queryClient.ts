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
			if (!query.meta?.loginStatusQuery) {
				// Erreur générée uniquement s'il ne s'agit pas de la vérification du token sur la page de connexion
				if (query.queryKey[0] === 'logout') {
					// Si suppression du token impossible
					toast.error('Impossible de vous déconnecter');
				} else if (error.message === 'Failed to fetch') {
					toast.error('Impossible de joindre le serveur');
				} else {
					toast.error(error.message);
					if (error.message.toLowerCase().includes('token')) {
						// Redirection vers l'index si problème de token
						window.location.href = '/';
					}
				}
			}
		},
		onSuccess: (_, query) => {
			if (query.queryKey[0] === 'logout') {
				toast.warning(
					'Vous avez été déconnecté, vous allez être redirigé vers la page de connexion'
				);
				queryClient.clear();
				setTimeout(() => {
					window.location.href = '/';
				}, 2000);
			}
		},
	}),

	mutationCache: new MutationCache({
		onError: (error) => {
			if (error.message === 'Failed to fetch') {
				toast.error('Impossible de joindre le serveur');
			} else {
				toast.error(error.message);
				if (error.message.toLowerCase().includes('token')) {
					// Redirection vers l'index si problème de token
					window.location.href = '/';
				}
			}
		},
	}),
});

export default queryClient;
