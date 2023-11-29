import { toast } from 'sonner';
import { useGetAllAttributedLines } from '../../utils/lineQueries';
import { Loader } from '@mantine/core';

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
		<div>
			Lignes attribuées ici
			<div>{JSON.stringify(lines)}</div>
		</div>
	);
}

export default AttributedLines;
