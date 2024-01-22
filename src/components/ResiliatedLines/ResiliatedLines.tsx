import { Loader } from '@mantine/core';
import { useGetAllLines } from '../../utils/lineQueries';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';

function ResiliatedLines() {
	const { data: lines, isLoading, isError } = useGetAllLines();

	if (isLoading) {
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);
	}

	if (isError) {
		return <div>Impossible de récupérer les lignes depuis le serveur</div>;
	}

	return (
		<ZoomableComponent className='resiliated-lines'>
			Lignes résiliées ici
			<div>{JSON.stringify(lines)}</div>
		</ZoomableComponent>
	);
}

export default ResiliatedLines;
