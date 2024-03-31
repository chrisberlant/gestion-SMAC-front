import '@mantine/core/styles.css';
import 'mantine-react-table/styles.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AgentsTable from './components/Agents/Agents';
import Devices from './components/Devices/Devices';
import Login from './components/Login/Login';
import PageNotFound from './components/PageNotFound/PageNotFound';
import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes';
import Stats from './components/Stats/Stats';
import Lines from './components/Lines/Lines';
import History from './components/History/History';

function AppRoutes() {
	return (
		<Routes>
			<Route element={<Login />} path='/' />
			{/* Routes protégées, la connexion est nécessaire */}
			<Route element={<PrivateRoutes />}>
				<Route element={<Lines />} path='/lines' />
				<Route element={<Devices />} path='/devices' />
				<Route element={<AgentsTable />} path='/agents' />
				<Route element={<Stats />} path='/stats' />
				<Route element={<History />} path='/history' />
				<Route element={<AdminDashboard />} path='/admin-dashboard' />
			</Route>
			<Route element={<PageNotFound />} path='*' />
		</Routes>
	);
}

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
