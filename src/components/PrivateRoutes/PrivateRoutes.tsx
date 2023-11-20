import { Outlet, Navigate } from 'react-router-dom';
import Header from '../Header/Header';

function PrivateRoutes() {
	const authenticatedUser = true; // TODO logique vérification authentification
	return authenticatedUser ? (
		<>
			<Header />
			<main className='app-content'>
				<Outlet />
			</main>
		</>
	) : (
		<Navigate to='/login' />
	);
}

export default PrivateRoutes;
