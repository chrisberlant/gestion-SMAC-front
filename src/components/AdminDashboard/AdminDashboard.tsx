import UsersTable from './UsersTable/UsersTable';
import ServicesTable from './ServicesTable/ServicesTable';
import './adminDashboard.css';
import ModelsTable from './ModelsTable/ModelsTable';
import { useGetCurrentUser } from '../../utils/userQueries';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AdminDashboard() {
	const { data: currentUser } = useGetCurrentUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser?.isAdmin === false) navigate('/');
	}, [currentUser?.isAdmin, navigate]);

	return (
		<div className='admin-dashboard'>
			<UsersTable />
			<div className='horizontal-align-div'>
				<ServicesTable />
				<ModelsTable />
			</div>
		</div>
	);
}

export default AdminDashboard;
