import { useGetDevicesAmountPerModel } from '@queries/statsQueries';
import StatsTable from '../StatsTable/StatsTable';
import Loading from '../../Loading/Loading';

export default function DevicesAmountPerModel() {
	const { data, isLoading, isError } = useGetDevicesAmountPerModel();
	const titles = ['Marque', 'Modèle', 'Stockage', "Nombre d'appareils"];

	return (
		<>
			{isLoading && <Loading />}

			{isError && (
				<div>
					Impossible de récupérer le nombre d'appareils par modèle
					depuis le serveur
				</div>
			)}

			{data && (
				<StatsTable
					data={data}
					titles={titles}
					tableTitle="Nombre d'appareils par modèle"
				/>
			)}
		</>
	);
}
