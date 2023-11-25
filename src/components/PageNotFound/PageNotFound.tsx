import { Link } from 'react-router-dom';
import './PageNotFound.css';
import { useGetCurrentUser } from '../../utils/queries';

function PageNotFound() {
	let redirectionPage = '/';
	const { data } = useGetCurrentUser();
	if (data) redirectionPage = '/active-lines';
	return (
		<div className='page-not-found'>
			<h1>404 - Page non trouvée</h1>
			<p>La page que vous recherchez n&apos;existe pas.</p>
			<Link to={redirectionPage} className='return-home'>
				Retour à la page d&apos;accueil
			</Link>
		</div>
	);
}

export default PageNotFound;
