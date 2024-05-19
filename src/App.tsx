import '@mantine/core/styles.css';
import 'mantine-react-table/styles.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { lazy } from 'react';
import { Toaster } from 'sonner';
import Login from '@components/Login/Login';
import PrivateRoutes from '@components/PrivateRoutes/PrivateRoutes';
const AdminDashboard = lazy(
	() => import('@components/AdminDashboard/AdminDashboard')
);
const Agents = lazy(() => import('./components/Agents/Agents'));
const Devices = lazy(() => import('./components/Devices/Devices'));
const PageNotFound = lazy(
	() => import('./components/PageNotFound/PageNotFound')
);
const Stats = lazy(() => import('./components/Stats/Stats'));
const Lines = lazy(() => import('./components/Lines/Lines'));
const History = lazy(() => import('./components/History/History'));
import './index.css';

const AppRoutes = () => (
	<Routes>
		<Route element={<Login />} path='/' />
		{/* Routes protégées, la connexion est nécessaire */}
		<Route element={<PrivateRoutes />}>
			<Route element={<Lines />} path='/lines' />
			<Route element={<Devices />} path='/devices' />
			<Route element={<Agents />} path='/agents' />
			<Route element={<Stats />} path='/stats' />
			<Route element={<History />} path='/history' />
			<Route element={<AdminDashboard />} path='/admin-dashboard' />
		</Route>
		<Route element={<PageNotFound />} path='*' />
	</Routes>
);

export default function App() {
	return (
		<Router>
			<div className='app'>
				<AppRoutes />
				<Toaster
					richColors
					closeButton
					expand={true}
					toastOptions={{
						style: {
							width: 'auto',
							position: 'absolute',
							right: '0px',
						},
					}}
				/>
			</div>
		</Router>
	);
}
