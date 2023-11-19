import '@mantine/core/styles.css';
import './App.css';
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { createContext, useContext, useState } from 'react';
import { UserInterface } from './@types/types';
import Login from './components/Login/Login';

const queryClient = new QueryClient();
const UserContext = createContext<UserInterface>(undefined);

function AppRoutes() {
	const [user, setUser] = useState<UserInterface>(undefined);
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider>
				<UserContext.Provider value={user}>
					<div className='app'>
						<Routes>
							{/* Homepage route, component not created yet */}
							<Route element={<Login />} path='/' />
							{/* Authentication route */}
							<Route element={<Login />} path='/login' />
							{/* Login creation route */}
							{/* <Route element={<Register />} path="/register" />
          {/* Protected routes, can only be accessed by authenticated user */}
							{/* <Route element={<PrivateRoutes />}> */}
							{/* See and edit account informations */}
							{/* <Route element={<Account />} path="/account" /> */}
						</Routes>
					</div>
				</UserContext.Provider>
			</MantineProvider>
		</QueryClientProvider>
	);
}

function App() {
	return (
		<Router>
			<AppRoutes />
		</Router>
	);
}

export default App;
