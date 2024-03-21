import { ScrollArea, Table, TextInput, keys, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import { StatsType } from '../../../types';
import Th from './TableHeader/TableHeader';
import './statsTable.css';

interface StatsTableProps {
	data: StatsType[] | [];
	titles: string[];
	tableTitle: string;
}

// Filtrer en fonction du champ de recherche
const filterData = (data: StatsType[], search: string) => {
	const query = search.toLowerCase().trim();
	return data?.filter((item) =>
		keys(data[0]).some((key) => item[key]?.toLowerCase().includes(query))
	);
};

// Ordre d'affichage
const sortData = (
	data: StatsType[],
	payload: {
		sortBy: string | null;
		reversed: boolean;
		search: string;
	}
) => {
	const { sortBy, reversed, search } = payload;

	// Si pas d'ordre par en-tête
	if (!sortBy) return filterData(data, search);

	return filterData(
		[...data].sort((a, b) => {
			// Ordre décroissant
			if (reversed) {
				return b[sortBy as keyof StatsType]?.localeCompare(
					a[sortBy as keyof StatsType]
				);
			}
			// Ordre croissant
			return a[sortBy as keyof StatsType]?.localeCompare(
				b[sortBy as keyof StatsType]
			);
		}),
		search
	);
};

export default function StatsTable({
	data,
	titles,
	tableTitle,
}: StatsTableProps) {
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState(data);
	const [sortBy, setSortBy] = useState<string | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);

	const setSorting = (field: string) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(data, { sortBy: field, reversed, search }));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(data, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			})
		);
	};

	// Si pas encore d'éléments à afficher, les en-têtes sont générés à partir des titres fournis
	const headersValues = data.length > 0 ? Object.keys(data[0]) : titles;
	// En-têtes du tableau
	const headers = headersValues.map((header, index) => (
		<Th
			key={index}
			sorted={sortBy === header}
			reversed={reverseSortDirection}
			onSort={() => setSorting(header)}
			title={titles[index]}
		/>
	));

	// Lignes du tableau
	const rows = sortedData.map((row, index) => (
		<Table.Tr key={index}>
			{Object.values(row).map((content, colIndex) => (
				<Table.Td align='center' key={colIndex}>
					{content}
				</Table.Td>
			))}
		</Table.Tr>
	));

	return (
		<div className='stats-table'>
			<ScrollArea>
				<div className='horizontal-align-div'>
					<TextInput
						placeholder='Filtrer'
						w={190}
						mb={0}
						leftSection={
							<IconSearch
								style={{ width: rem(16), height: rem(16) }}
								stroke={1.5}
							/>
						}
						value={search}
						onChange={handleSearchChange}
					/>
					<span className='stats-table-title'>{tableTitle}</span>
				</div>
				<Table
					horizontalSpacing='md'
					verticalSpacing='xs'
					miw={400}
					maw={700}
				>
					<Table.Tbody>
						<Table.Tr>{headers}</Table.Tr>
					</Table.Tbody>
					<Table.Tbody>{rows}</Table.Tbody>
				</Table>
			</ScrollArea>
		</div>
	);
}
