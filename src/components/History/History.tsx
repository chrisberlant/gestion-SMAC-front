import {
	MRT_ColumnDef,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { useGetAllHistory } from '@queries/historyQueries';
import { HistoryType } from '@customTypes/history';
import { useGetAllUsers } from '@queries/userQueries';
import { dateTimeToStringFormatting } from '@utils/index';
import DeleteHistoryButton from '../TableActionsButtons/DeleHistoryButton/DeleteHistoryButton';
import Loading from '../Loading/Loading';
import { paginatedTableConfig } from '@utils/tableConfig';

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
				header: 'Élément',
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
				header: 'Date/Heure',
				accessorKey: 'createdAt',
				Cell: ({ row }) =>
					dateTimeToStringFormatting(row.original.createdAt),
			},
			{ header: 'Action', accessorKey: 'content' },
			{
				header: 'Auteur',
				accessorKey: 'userId',
				minSize: 150,
				Cell: ({ row }) =>
					formattedUsers?.find(
						(user) => user.id === row.original.userId
					)?.fullName,
			},
		],
		[formattedUsers]
	);

	const table = useMantineReactTable({
		...paginatedTableConfig,
		initialState: {
			density: 'xs',
			pagination: {
				pageIndex: 0,
				pageSize: 10,
			},
			columnVisibility: {
				id: false,
			},
		},
		enableEditing: false,
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
		mantineTableBodyRowProps: ({ row }) => ({
			onClick: row.getToggleSelectedHandler(),
		}),
		renderTopToolbarCustomActions: ({ table }) => {
			// Conversion de l'objet contenant les lignes sélectionnées en tableau de nombres
			const entriesToDelete = Object.keys(
				table.getState().rowSelection
			).map(Number);
			return (
				<DeleteHistoryButton
					enabledButton={table.getIsSomeRowsSelected()}
					entriesToDelete={entriesToDelete}
				/>
			);
		},
	});

	return (
		<div className='models-table'>
			<h2>Historique des actions</h2>

			{(isHistoryLoading || isUsersLoading) && <Loading />}

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
