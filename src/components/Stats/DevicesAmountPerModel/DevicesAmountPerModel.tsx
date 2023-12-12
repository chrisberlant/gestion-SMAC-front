import { useGetDevicesAmountPerModel } from '../../../utils/statsQueries';
import { Loader } from '@mantine/core';

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

	return <div>Nombre d'appareils par modèle {JSON.stringify(data)}</div>;
}

export default DevicesAmountPerModel;
