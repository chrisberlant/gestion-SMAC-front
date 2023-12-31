import { toast } from 'sonner';
import { useGetAllDevices } from '../../utils/deviceQueries';
import { Loader } from '@mantine/core';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';

function Devices() {
	const { data: devices, isLoading, isError, error } = useGetAllDevices();

	if (isLoading)
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);

	if (isError) {
		toast.error('Impossible de récupérer les appareils depuis le serveur');
		return <div>{error!.message}</div>;
	}

	return (
		<ZoomableComponent className='devices'>
			Liste des appareils ici
			<div>{JSON.stringify(devices)}</div>
		</ZoomableComponent>
	);
}

export default Devices;
