import { useGetAgentsAndDevicesPerService } from '@queries/statsQueries';
import StatsTable from '../StatsTable/StatsTable';
import Loading from '../../Loading/Loading';

export default function AgentsAndDevicesPerService() {
	const { data, isLoading, isError } = useGetAgentsAndDevicesPerService();
	const titles = ['Service', "Nombre d'agents", "Nombre d'appareils"];

	return (
		<>
			{isLoading && <Loading />}

			{isError && (
				<div>
					Impossible de récupérer le nombre d'agents et d'appareils
					par service depuis le serveur
				</div>
			)}

			{data && (
				<StatsTable
					data={data}
					titles={titles}
					tableTitle="Nombre d'agents et appareils par service"
				/>
			)}
		</>
	);
}
