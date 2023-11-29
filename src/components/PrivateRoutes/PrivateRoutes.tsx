import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import PageTopScroller from '../PageTopScroller/PageTopScroller';

function PrivateRoutes() {
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

export default PrivateRoutes;
