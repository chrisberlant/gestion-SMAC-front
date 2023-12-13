import { useGetAgentsAndDevicesPerService } from '../../../utils/statsQueries';
import { Loader } from '@mantine/core';
import StatsTable from '../StatsTable/StatsTable';

function AgentsAndDevicesPerService() {
	const { data, isLoading, isError } = useGetAgentsAndDevicesPerService();

	if (isLoading) {
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);
	}

	if (isError) {
		return (
			<div>
				Impossible de récupérer le nombre d'agents et d'appareils par
				service depuis le serveur
			</div>
		);
	}

	const titles = ['Service', "Nombre d'agents", "Nombre d'appareils"];
	return (
		<StatsTable
			data={data!}
			titles={titles}
			tableTitle="Nombre d'agents et appareils par
	service"
		/>
	);
}

export default AgentsAndDevicesPerService;
