import { useGetAgentsAndDevicesPerService } from '../../../utils/statsQueries';
import { Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Table, ScrollArea, TextInput, rem, keys } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { AgentsAndDevicesPerServiceType } from '../../../@types/types';
import Th from '../TableHeader/TableHeader';

function filterData(data: AgentsAndDevicesPerServiceType[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
	);
}

function sortData(
	data: AgentsAndDevicesPerServiceType[],
	payload: {
		sortBy: keyof AgentsAndDevicesPerServiceType | null;
		reversed: boolean;
		search: string;
	}
) {
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(data, payload.search);
	}

	return filterData(
		[...data].sort((a, b) => {
			if (payload.reversed) {
				return b[sortBy].localeCompare(a[sortBy]);
			}

			return a[sortBy].localeCompare(b[sortBy]);
		}),
		payload.search
	);
}

function AgentsAndDevicesPerService() {
	const { data, isLoading, isError } = useGetAgentsAndDevicesPerService();
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState<
		AgentsAndDevicesPerServiceType[] | null
	>(null);
	const [sortBy, setSortBy] = useState<
		keyof AgentsAndDevicesPerServiceType | null
	>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);

	useEffect(() => {
		if (data) setSortedData(data);
	}, [data]);

	if (isLoading) {
		return (
			<div className='loader-box'>
				<Loader size='xl' />
			</div>
		);
	}

	if (isError) {
		return (
			<div>
				Impossible de récupérer le nombre d'agents et appareils par
				service depuis le serveur
			</div>
		);
	}

	const setSorting = (field: keyof AgentsAndDevicesPerServiceType) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(data!, { sortBy: field, reversed, search }));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(data!, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			})
		);
	};

	const rows = sortedData?.map((row) => (
		<Table.Tr key={row.service}>
			<Table.Td>{row.service}</Table.Td>
			<Table.Td>{row.agentsAmount}</Table.Td>
			<Table.Td>{row.devicesAmount}</Table.Td>
		</Table.Tr>
	));

	return (
		<div>
			<ScrollArea>
				<TextInput
					placeholder='Rechercher un service'
					w={190}
					mb='md'
					leftSection={
						<IconSearch
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
					value={search}
					onChange={handleSearchChange}
				/>
				<Table
					horizontalSpacing='md'
					verticalSpacing='xs'
					miw={700}
					layout='fixed'
				>
					<Table.Tbody>
						<Table.Tr>
							<Th
								sorted={sortBy === 'service'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('service')}
								title='Service'
							/>
							<Th
								sorted={sortBy === 'agentsAmount'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('agentsAmount')}
								title="Nombre d'agents"
							/>
							<Th
								sorted={sortBy === 'devicesAmount'}
								reversed={reverseSortDirection}
								onSort={() => setSorting('devicesAmount')}
								title="Nombre d'appareils"
							/>
						</Table.Tr>
					</Table.Tbody>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</ScrollArea>
		</div>
	);
}

export default AgentsAndDevicesPerService;
