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
	console.log(history);

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
			},
			{
				header: 'Élément concerné',
				accessorKey: 'table',
			},
			{
				header: 'Date',
				id: 'createdAt',
				accessorFn: (row) => {
					return console.log(row.createdAt);
				},
			},
			{ header: 'Action', accessorKey: 'content' },
			{
				header: 'Auteur',
				id: 'userId',
				size: 150,
				accessorFn: (row) =>
					formattedUsers?.find((user) => user.id === row.userId)
						?.fullName,
			},
		],
		[formattedUsers]
	);

	const table = useMantineReactTable({
		columns,
		data: history || [],
		enableGlobalFilter: true,
		enableColumnActions: true,
		createDisplayMode: 'row',
		editDisplayMode: 'row',
		enableEditing: true,
		enableHiding: false,
		sortDescFirst: true,
		enableSortingRemoval: false,
		enableDensityToggle: false,
		mantineSearchTextInputProps: {
			placeholder: 'Rechercher',
			// style: { minWidth: '100px' },
			variant: 'default',
		},
		paginationDisplayMode: 'pages',
		mantineTableContainerProps: { style: { minWidth: '40vw' } },
		// renderRowActions: ({ row, table }) => (
		// 	<EditDeleteButtons
		// 		editFunction={() => table.setEditingRow(row)}
		// 		deleteFunction={() =>
		// 			displayModelDeleteModal({ row, deleteModel })
		// 		}
		// 		roleCheck={false}
		// 	/>
		// ),
		mantineTableProps: {
			striped: true,
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

			{isHistoryLoading && isUsersLoading && (
				<div className='loader-box'>
					<Loader size='xl' />
				</div>
			)}

			{isHistoryError && isUsersError && (
				<span>
					Impossible de récupérer l'historique des actions depuis le
					serveur
				</span>
			)}

			{history && <MantineReactTable table={table} />}
		</div>
	);
}
