import { ServiceType } from '../../../types';
import { Table, Group, Text, ActionIcon, rem, Loader } from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { useGetAllServices } from '@utils/serviceQueries';
import './servicesTable.css';

function ServicesTable() {
	const { data: services, isLoading, isError } = useGetAllServices();

	if (isLoading)
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);

	if (isError) {
		return (
			<div>Impossible de récupérer les services depuis le serveur</div>
		);
	}

	const rows = services!.map((service: ServiceType) => (
		<Table.Tr key={service.title}>
			<Table.Td>
				<Group gap='sm'>
					<Text fz='sm' fw={500}>
						{service.title}
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
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					</ActionIcon>
				</Group>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<div className='services-table'>
			<h2>Gérer les services</h2>
			<IconPlus cursor='pointer' aria-label='Ajouter un service' />
			<Table verticalSpacing='sm' striped highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Service</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</div>
	);
}

export default ServicesTable;
