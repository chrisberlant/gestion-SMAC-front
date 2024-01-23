import '@mantine/core/styles.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AttributedLines from './components/AttributedLines/AttributedLines';
import Devices from './components/Devices/Devices';
import Login from './components/Login/Login';
import PageNotFound from './components/PageNotFound/PageNotFound';
import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes';
import ResiliatedLines from './components/ResiliatedLines/ResiliatedLines';
import Stats from './components/Stats/Stats';

function AppRoutes() {
	return (
		<Routes>
			<Route element={<Login />} path='/' />
			{/* Protected routes, can only be accessed by authenticated user */}
			<Route element={<PrivateRoutes />}>
				<Route element={<AttributedLines />} path='/attributed-lines' />
				<Route element={<ResiliatedLines />} path='/resiliated-lines' />
				<Route element={<Devices />} path='/devices' />
				<Route element={<AdminDashboard />} path='/admin-dashboard' />
				<Route element={<Stats />} path='/stats' />
			</Route>
			<Route element={<PageNotFound />} path='*' />
		</Routes>
	);
}

function App() {
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

export default App;
