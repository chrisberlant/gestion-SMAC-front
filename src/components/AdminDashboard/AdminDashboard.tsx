import { Loader } from '@mantine/core';
import { useGetAdminDashboard } from '../../utils/queries';
import { notifications } from '@mantine/notifications';

function AdminDashboard() {
	const { data, isLoading, isError, error } = useGetAdminDashboard();

	if (isLoading) return <Loader size='xl' />;

	if (isError) {
		notifications.show({
			color: 'red',
			title: 'Erreur lors de la requête',
			message: error.message,
		});
		return <div className='error'>Erreur</div>;
	}
	return <div className='dashboard'>{JSON.stringify(data)}</div>;
}

export default AdminDashboard;
