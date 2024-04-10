import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import PageTopScroller from '../PageTopScroller/PageTopScroller';
import { useGetCurrentUser } from '@queries/userQueries';
import { Loader } from '@mantine/core';
import { Suspense } from 'react';

export default function PrivateRoutes() {
	const { data: loggedUser } = useGetCurrentUser();

	if (loggedUser) {
		return (
			<>
				<Header />
				<main className='app-content'>
					<Suspense fallback={<Loader size='xl' />}>
						<Outlet />
					</Suspense>
					<PageTopScroller />
				</main>
			</>
		);
	}
}
