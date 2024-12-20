import '@mantine/core/styles.css';
import 'mantine-react-table/styles.css';
import '@mantine/charts/styles.css';
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';
import { lazy } from 'react';
import Login from '@/components/Login/Login';
import PrivateRoutesLayout from '@/components/PrivateRoutesLayout/PrivateRoutesLayout';
const Agents = lazy(() => import('@/components/Agents/Agents'));
const Devices = lazy(() => import('@/components/Devices/Devices'));
const PageNotFound = lazy(
	() => import('@/components/PageNotFound/PageNotFound')
);
const Stats = lazy(() => import('@/components/Stats/Stats'));
const Lines = lazy(() => import('@/components/Lines/Lines'));
const AdminDashboard = lazy(
	() => import('@/components/AdminDashboard/AdminDashboard')
);
const History = lazy(() => import('@/components/History/History'));
const UsersTable = lazy(
	() => import('@/components/AdminDashboard/UsersTable/UsersTable')
);
const ModelsTable = lazy(
	() => import('@/components/AdminDashboard/ModelsTable/ModelsTable')
);
const ServicesTable = lazy(
	() => import('@/components/AdminDashboard/ServicesTable/ServicesTable')
);
const AdminHomePage = lazy(
	() => import('@/components/AdminDashboard/AdminHomePage/AdminHomepage')
);
const DevicesAmountPerModel = lazy(
	() =>
		import('@/components/Stats/DevicesAmountPerModel/DevicesAmountPerModel')
);
const AgentsAndDevicesPerService = lazy(
	() =>
		import(
			'@/components/Stats/AgentsAndDevicesPerService/AgentsAndDevicesPerService'
		)
);
import './index.css';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route element={<Login />} path='/' />
			{/* Routes protégées, la connexion est nécessaire */}
			<Route element={<PrivateRoutesLayout />}>
				<Route element={<Lines />} path='/lines' />
				<Route element={<Devices />} path='/devices' />
				<Route element={<Agents />} path='/agents' />
				{/* Routes stats */}
				<Route element={<Stats />} path='/stats'>
					<Route element={<DevicesAmountPerModel />} index />
					<Route
						element={<DevicesAmountPerModel />}
						path='/stats/devices-amount-per-model'
					/>
					<Route
						element={<AgentsAndDevicesPerService />}
						path='/stats/agents-and-devices-per-service'
					/>
				</Route>
				{/* Routes admin */}
				<Route element={<AdminDashboard />} path='/admin-dashboard'>
					<Route element={<AdminHomePage />} index />
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
