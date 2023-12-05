import { useGetAllAttributedLines } from '../../utils/lineQueries';
import { Loader } from '@mantine/core';
import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';

function AttributedLines() {
	const { data: lines, isLoading, isError } = useGetAllAttributedLines();

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
			Lignes attribuées ici
			<div>{JSON.stringify(lines)}</div>
		</ZoomableComponent>
	);
}

export default AttributedLines;
