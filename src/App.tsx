import '@mantine/core/styles.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';
import { UserInterface } from './@types/types.ts';
import Login from './components/Login/Login';
import Header from './components/Header/Header';
import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes';
import ActiveLines from './components/ActiveLines/ActiveLines';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PageNotFound from './components/PageNotFound/PageNotFound';
import { Toaster } from 'sonner';

function AppRoutes() {
	return (
		<Routes>
			<Route element={<Login />} path='/' />
			<Route element={<Login />} path='/login' />
			<Route element={<Header />} path='/header' />
			{/* Protected routes, can only be accessed by authenticated user */}
			<Route element={<PrivateRoutes />}>
				<Route element={<ActiveLines />} path='/active-lines' />
				<Route element={<AdminDashboard />} path='/admin-dashboard' />
			</Route>
			<Route element={<PageNotFound />} path='*' />
		</Routes>
	);
}

const UserContext = createContext<UserInterface>(undefined);

function App() {
	const [user, setUser] = useState<UserInterface>(undefined);
	return (
		<UserContext.Provider value={user}>
			<Router>
				<div className='app'>
					<AppRoutes />
					<Toaster richColors closeButton expand={true} />
				</div>
			</Router>
		</UserContext.Provider>
	);
}

export default App;
