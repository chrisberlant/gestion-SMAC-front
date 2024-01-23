import { Loader } from '@mantine/core';
import { useGetDevicesAmountPerModel } from '../../../utils/statsQueries';
import StatsTable from '../StatsTable/StatsTable';

function DevicesAmountPerModel() {
	const { data, isLoading, isError } = useGetDevicesAmountPerModel();

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
				Impossible de récupérer le nombre d'appareils par modèle depuis
				le serveur
			</div>
		);
	}

	const titles = ['Marque', 'Modèle', 'Stockage', "Nombre d'appareils"];
	return (
		<StatsTable
			data={data!}
			titles={titles}
			tableTitle="Nombre d'appareils par modèle"
		/>
	);
}

export default DevicesAmountPerModel;
