import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import PageTopScroller from '../PageTopScroller/PageTopScroller';
import { useGetCurrentUser } from '@queries/userQueries';
import { Suspense } from 'react';
import Loading from '../Loading/Loading';

export default function PrivateRoutes() {
	const { data: loggedUser } = useGetCurrentUser();

	if (loggedUser) {
		return (
			<>
				<Header />
				<main className='app-content'>
					<Suspense fallback={<Loading />}>
						<Outlet />
					</Suspense>
					<PageTopScroller />
				</main>
			</>
		);
	}
}
