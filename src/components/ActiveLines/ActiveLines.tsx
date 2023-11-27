import { toast } from 'sonner';
import { useGetAllActiveLines } from '../../utils/queries';
import { Loader } from '@mantine/core';

function ActiveLines() {
	const { data: lines, isLoading, isError, error } = useGetAllActiveLines();

	if (isLoading)
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);

	if (isError) {
		toast.error('Impossible de récupérer les lignes depuis le serveur');
		return <div>{error!.message}</div>;
	}

	return (
		<div>
			Lignes actives ici
			<div>{JSON.stringify(lines)}</div>
		</div>
	);
}

export default ActiveLines;
