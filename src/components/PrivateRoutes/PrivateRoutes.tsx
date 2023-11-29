import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import PageTopScroller from '../PageTopScroller/PageTopScroller';
import { useGetCurrentUser } from '../../utils/userQueries';

function PrivateRoutes() {
	const { data: loggedUser } = useGetCurrentUser();

	if (loggedUser) {
		return (
			<>
				<Header />
				<main className='app-content'>
					<Outlet />
					<PageTopScroller />
				</main>
			</>
		);
	}
}

export default PrivateRoutes;
