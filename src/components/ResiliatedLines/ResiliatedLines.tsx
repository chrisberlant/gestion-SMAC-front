import { useGetAllResiliatedLines } from '../../utils/lineQueries';
import { Loader } from '@mantine/core';

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
		<div>
			Lignes résiliées ici
			<div>{JSON.stringify(lines)}</div>
		</div>
	);
}

export default ResiliatedLines;
