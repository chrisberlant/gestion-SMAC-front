import UsersTable from './UsersTable/UsersTable';
import ServicesTable from './ServicesTable/ServicesTable';
import './adminDashboard.css';
import { useGetCurrentUser } from '../../utils/userQueries';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';
import ModelsTable from './ModelsTable/ModelsTable';

function AdminDashboard() {
	const { data: currentUser } = useGetCurrentUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser?.isAdmin === false) navigate('/');
	}, [currentUser?.isAdmin, navigate]);

	return (
		<ZoomableComponent className='admin-dashboard'>
			<UsersTable />
			<div className='horizontal-align-div'>
				<ServicesTable />
				<ModelsTable />
			</div>
		</ZoomableComponent>
	);
}

export default AdminDashboard;
