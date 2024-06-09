import '@mantine/core/styles.css';
import 'mantine-react-table/styles.css';
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';
import { lazy } from 'react';

import Login from '@components/Login/Login';
import PrivateRoutesLayout from '@components/PrivateRoutesLayout/PrivateRoutesLayout';
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
import UsersTable from './components/AdminDashboard/UsersTable/UsersTable';
import ModelsTable from './components/AdminDashboard/ModelsTable/ModelsTable';
import ServicesTable from './components/AdminDashboard/ServicesTable/ServicesTable';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route element={<Login />} path='/' />
			{/* Routes protégées, la connexion est nécessaire */}
			<Route element={<PrivateRoutesLayout />}>
				<Route element={<Lines />} path='/lines' />
				<Route element={<Devices />} path='/devices' />
				<Route element={<Agents />} path='/agents' />
				<Route element={<Stats />} path='/stats' />
				{/* Routes admin */}
				<Route element={<AdminDashboard />} path='/admin-dashboard'>
					<Route
						element={<UsersTable />}
						path='/admin-dashboard/users'
					/>
					<Route
						element={<ModelsTable />}
						path='/admin-dashboard/models'
					/>
					<Route
						element={<UsersTable />}
						path='/admin-dashboard/users'
					/>
					<Route
						element={<ServicesTable />}
						path='/admin-dashboard/services'
					/>
					<Route
						element={<History />}
						path='/admin-dashboard/history'
					/>
				</Route>
			</Route>
			<Route element={<PageNotFound />} path='*' />
		</Route>
	)
);

export default function App() {
	return <RouterProvider router={router} />;
}
