import { useGetAllResiliatedLines } from '../../utils/lineQueries';
import { Loader } from '@mantine/core';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';

function ResiliatedLines() {
	const { data: lines, isLoading, isError } = useGetAllResiliatedLines();

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
		<ZoomableComponent>
			Lignes résiliées ici
			<div>{JSON.stringify(lines)}</div>
		</ZoomableComponent>
	);
}

export default ResiliatedLines;
