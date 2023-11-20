import { useGetAdminDashboard } from '../../utils/queries';

function AdminDashboard() {
	const { data, isLoading, error } = useGetAdminDashboard();

	if (isLoading) return <div>Chargement...</div>;

	return <div>{JSON.stringify(data)}</div>;
}

export default AdminDashboard;
