import UsersTable from './UsersTable/UsersTable';
import ServicesTable from './ServicesTable/ServicesTable';
import './adminDashboard.css';
import ModelsTable from './ModelsTable/ModelsTable';

function AdminDashboard() {
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
