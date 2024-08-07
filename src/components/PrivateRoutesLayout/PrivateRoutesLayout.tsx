import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import PageTopScroller from '../PageTopScroller/PageTopScroller';
import { useGetCurrentUser } from '@/hooks/authQueries';
import { Suspense, useState } from 'react';
import Loading from '../Loading/Loading';
import { Slider } from '@mantine/core';

export default function PrivateRoutesLayout() {
	const { data: loggedUser } = useGetCurrentUser();
	const [zoom, setZoom] = useState(100);

	return (
		loggedUser && (
			<div className='app'>
				<Header />
				<Slider
					pos='absolute'
					right={50}
					color='blue'
					size='sm'
					min={50}
					max={100}
					step={5}
					label={(value) => `${value}%`}
					marks={[{ value: 50 }, { value: 75 }, { value: 100 }]}
					value={zoom}
					onChange={setZoom}
					w={100}
				/>
				<main
					className='app-content'
					style={{ transform: `scale(${zoom / 100})` }}
				>
					<Suspense fallback={<Loading />}>
						<Outlet />
					</Suspense>
					<PageTopScroller />
				</main>
			</div>
		)
	);
}
