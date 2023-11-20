import { Link } from 'react-router-dom';
import './PageNotFound.css';

function PageNotFound() {
	return (
		<div className='page-not-found'>
			<h1>404 - Page non trouvée</h1>
			<p>La page que vous recherchez n&apos;existe pas.</p>
			<Link to='/' className='return-home'>
				Retour à la page d&apos;accueil
			</Link>
		</div>
	);
}

export default PageNotFound;
