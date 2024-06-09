import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useGetCurrentUser } from '@queries/authQueries';
import './adminDashboard.css';
import AdminNavBar from './AdminNavBar/AdminNavBar';
import { Flex } from '@mantine/core';

export default function AdminDashboard() {
	const { data: currentUser } = useGetCurrentUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser?.role !== 'Admin') navigate('/');
	}, [currentUser?.role, navigate]);

	return (
		currentUser?.role === 'Admin' && (
			<Flex className='admin-dashboard'>
				<AdminNavBar />
				<Flex justify='center' w='100%'>
					<Outlet />
				</Flex>
			</Flex>
		)
	);
}
