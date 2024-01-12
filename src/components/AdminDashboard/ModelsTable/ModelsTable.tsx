import { ModelType } from '../../../types';
import { Table, Group, Text, ActionIcon, rem, Loader } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react';
import { useGetAllModels } from '../../../utils/modelQueries';
import { toast } from 'sonner';
import './modelsTables.css';
import { modals } from '@mantine/modals';

function ModelsTable() {
	const { data: models, isLoading, isError } = useGetAllModels();

	if (isLoading)
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);

	if (isError) {
		return <div>Impossible de récupérer les modèles depuis le serveur</div>;
	}

	const openDeleteModal = (refToDelete: string) => {
		modals.openConfirmModal({
			title: 'Supprimer un modèle',
			centered: true,
			children: (
				<Text size='sm'>
					Êtes-vous sûr de vouloir supprimer le modèle {refToDelete} ?
				</Text>
			),
			labels: { confirm: 'Supprimer', cancel: 'Annuler' },
			confirmProps: { color: 'red' },
			onCancel: () => console.log('Cancel'),
			onConfirm: () => toast.success('Modèle supprimé'), // TODO fetch
		});
	};

	const rows = models!.map((model: ModelType) => (
		<Table.Tr key={model.id}>
			<Table.Td>
				<Group gap='sm'>
					<Text fz='sm' fw={500}>
						{model.brand}
					</Text>
				</Group>
			</Table.Td>
			<Table.Td>
				<Group gap='sm'>
					<Text fz='sm' fw={500}>
						{model.reference}
					</Text>
				</Group>
			</Table.Td>
			<Table.Td>
				<Group gap='sm'>
					<Text fz='sm' fw={500}>
						{model.storage}
					</Text>
				</Group>
			</Table.Td>
			<Table.Td width={80}>
				<Group gap={0} justify='flex-end'>
					<ActionIcon variant='subtle' color='gray'>
						<IconPencil
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</ActionIcon>
					<ActionIcon variant='subtle' color='red'>
						<IconTrash
							onClick={() =>
								openDeleteModal(
									model.brand +
										' ' +
										model.reference +
										' ' +
										model.storage
								)
							}
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<div className='models-table'>
			<h2>Gérer les modèles</h2>
			<IconPlus cursor='pointer' aria-label='Ajouter un modèle' />
			<Table verticalSpacing='sm' striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Marque</Table.Th>
						<Table.Th>Modèle</Table.Th>
						<Table.Th>Stockage</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</div>
	);
}

export default ModelsTable;
