import { Loader } from '@mantine/core';
import { useGetAdminDashboard } from '../../utils/queries';
import { toast } from 'sonner';
import UsersTable from './UsersTable/UsersTable';

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
		</div>
	);
}

export default AdminDashboard;
