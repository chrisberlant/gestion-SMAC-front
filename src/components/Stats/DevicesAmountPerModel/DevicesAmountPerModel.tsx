import { useGetDevicesAmountPerModel } from '../../../utils/statsQueries';
import { Loader } from '@mantine/core';
import StatsTable from '../StatsTable/StatsTable';

export default function DevicesAmountPerModel() {
	const { data, isLoading, isError } = useGetDevicesAmountPerModel();
	const titles = ['Marque', 'Modèle', 'Stockage', "Nombre d'appareils"];

	return (
		<>
			{isLoading && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{isError && (
				<div>
					Impossible de récupérer le nombre d'appareils par modèle
					depuis le serveur
				</div>
			)}

			{data && (
				<StatsTable
					data={data!}
					titles={titles}
					tableTitle="Nombre d'appareils par modèle"
				/>
			)}
		</>
	);
}
