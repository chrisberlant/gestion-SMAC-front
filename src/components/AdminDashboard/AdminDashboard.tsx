import { Loader } from '@mantine/core';
import { useGetAdminDashboard } from '../../utils/queries';
import { toast } from 'sonner';
import UsersTable from './UsersTable/UsersTable';
import ServicesTable from './ServicesTable/ServicesTable';
import './adminDashboard.css';
import ModelsTable from './ModelsTable/ModelsTable';

function AdminDashboard() {
	const { data, isLoading, isError, error } = useGetAdminDashboard();

	if (isLoading) return <Loader size='xl' />;

	if (isError) {
		toast.error('Impossible de récupérer les informations du serveur');
		return <div className='error'>{error.message}</div>;
	}

	return (
		<div className='admin-dashboard'>
			<UsersTable users={data!.users} />
			<div className='horizontal-align-div'>
				<ServicesTable services={data!.services} />
				<ModelsTable models={data!.models} />
			</div>
		</div>
	);
}

export default AdminDashboard;
