import { Container, Title, Text, Button, Group } from '@mantine/core';
import Illustration from './Illustration/Illustration';
import classes from './pageNotFound.module.css';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
	const navigate = useNavigate();

	return (
		<main>
			<Container className={classes.root}>
				<div className={classes.inner}>
					<Illustration className={classes.image} />
					<div className={classes.content}>
						<Title className={classes.title}>
							Page non trouvée
						</Title>
						<Text
							c='dimmed'
							size='lg'
							ta='center'
							className={classes.description}
						>
							La page que vous recherchez n&apos;existe pas.
						</Text>
						<Group justify='center'>
							{window.history.length > 2 ? (
								<Button size='md' onClick={() => navigate(-1)}>
									Retour à la page précédente
								</Button>
							) : (
								<Button
									size='md'
									onClick={() => navigate('/active-lines')}
								>
									Retour à la page d'accueil
								</Button>
							)}
						</Group>
					</div>
				</div>
			</Container>
		</main>
	);
}

export default PageNotFound;
