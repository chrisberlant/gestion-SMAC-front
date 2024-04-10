import {
	MRT_ColumnDef,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { useGetAllHistory } from '../../queries/historyQueries';
import { HistoryType } from '../../types/history';
import { Loader } from '@mantine/core';
import { useGetAllUsers } from '../../queries/userQueries';
import { dateTimeToStringFormatting } from '../../utils';
import DeleteHistoryButton from '../TableActionsButtons/DeleHistoryButton/DeleteHistoryButton';

export default function History() {
	const {
		data: history,
		isLoading: isHistoryLoading,
		isError: isHistoryError,
	} = useGetAllHistory();
	const {
		data: users,
		isLoading: isUsersLoading,
		isError: isUsersError,
	} = useGetAllUsers();

	const formattedUsers = useMemo(
		() =>
			users?.map((user) => ({
				id: user.id,
				fullName: `${user.lastName} ${user.firstName}`,
			})),
		[users]
	);

	const columns = useMemo<MRT_ColumnDef<HistoryType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
			},
			{
				header: 'Opération',
				accessorKey: 'operation',
				size: 50,
			},
			{
				header: 'Élément concerné',
				accessorKey: 'table',
				Cell: ({ row }) => {
					let value = '';
					switch (row.original.table) {
						case 'user':
							return (value = 'Utilisateur');
						case 'agent':
							return (value = 'Agent');
						case 'service':
							return (value = 'Service');
						case 'model':
							return (value = 'Modèle');
						case 'device':
							return (value = 'Appareil');
						case 'line':
							return (value = 'Ligne');
						default:
							return value;
					}
				},
			},
			{
				header: 'Date/heure',
				accessorKey: 'createdAt',
				Cell: ({ row }) =>
					dateTimeToStringFormatting(row.original.createdAt),
			},
			{ header: 'Action', accessorKey: 'content' },
			{
				header: 'Auteur',
				accessorKey: 'userId',
				size: 150,
				Cell: ({ row }) =>
					formattedUsers?.find(
						(user) => user.id === row.original.userId
					)?.fullName,
			},
		],
		[formattedUsers]
	);

	const table = useMantineReactTable({
		columns,
		data: history || [],
		enableRowSelection: true,
		getRowId: (originalRow) => String(originalRow.id),
		mantineSelectCheckboxProps: {
			color: 'red',
		},
		mantineSelectAllCheckboxProps: {
			color: 'red',
		},
		enableGlobalFilter: true,
		enableColumnActions: true,
		enableHiding: false,
		sortDescFirst: true,
		enableSortingRemoval: false,
		enableDensityToggle: false,
		mantineSearchTextInputProps: {
			placeholder: 'Rechercher',
			// style: { minWidth: '100px' },
			variant: 'default',
		},
		mantineTableBodyRowProps: ({ row }) => ({
			onClick: row.getToggleSelectedHandler(),
		}),
		paginationDisplayMode: 'pages',
		mantineTableContainerProps: { style: { minWidth: '40vw' } },
		mantineTableProps: {
			striped: true,
		},
		renderTopToolbarCustomActions: () => {
			// Conversion de l'objet contenant les lignes sélectionnées en tableau des nombre
			const entriesToDelete = Object.keys(
				table.getState().rowSelection
			).map(Number);
			return <DeleteHistoryButton entriesToDelete={entriesToDelete} />;
		},
		mantineTopToolbarProps: {
			mt: 'xs',
			mr: 'xs',
		},
		mantineBottomToolbarProps: {
			mt: 'sm',
			mb: 'xs',
			mx: 'xl',
		},
		initialState: {
			density: 'xs',
			pagination: {
				pageIndex: 0, // page start
				pageSize: 10, // rows per page
			},
			columnVisibility: {
				id: false,
			},
		},
		mantinePaginationProps: {
			rowsPerPageOptions: ['10', '30', '50', '100', '200'],
			withEdges: true,
		},
	});

	return (
		<div className='models-table'>
			<h2>Historique des actions</h2>

			{isHistoryLoading && isUsersLoading && <Loader size='xl' />}

			{isHistoryError && isUsersError && (
				<span>
					Impossible de récupérer l'historique des actions depuis le
					serveur
				</span>
			)}

			{history && users && <MantineReactTable table={table} />}
		</div>
	);
}
