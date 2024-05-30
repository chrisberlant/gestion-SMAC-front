import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUser } from '@queries/authQueries';
import ModelsTable from './ModelsTable/ModelsTable';
import ServicesTable from './ServicesTable/ServicesTable';
import UsersTable from './UsersTable/UsersTable';
import './adminDashboard.css';

export default function AdminDashboard() {
	const { data: currentUser } = useGetCurrentUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser?.role !== 'Admin') navigate('/');
	}, [currentUser?.role, navigate]);

	return (
		currentUser?.role === 'Admin' && (
			<div className='admin-dashboard'>
				<UsersTable />
				<div className='horizontal-align-div'>
					<ServicesTable />
					<ModelsTable />
				</div>
			</div>
		)
	);
}
