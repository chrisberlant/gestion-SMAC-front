import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes';
// import AttributedLines from './components/AttributedLines/AttributedLines';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PageNotFound from './components/PageNotFound/PageNotFound';
import Devices from './components/Devices/Devices';
import { Toaster } from 'sonner';
import ResiliatedLines from './components/ResiliatedLines/ResiliatedLines';
import './App.css';
import Stats from './components/Stats/Stats';
import AttributedLines2 from './components/AttributedLines/AttributedLines2';

function AppRoutes() {
	return (
		<Routes>
			<Route element={<Login />} path='/' />
			{/* Protected routes, can only be accessed by authenticated user */}
			<Route element={<PrivateRoutes />}>
				<Route
					element={<AttributedLines2 />}
					path='/attributed-lines'
				/>
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
