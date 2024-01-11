import { useGetAllServices, useUpdateService } from '@utils/serviceQueries';
import {
	MantineReactTable,
	useMantineReactTable,
	type MRT_ColumnDef,
} from 'mantine-react-table';
import { useMemo } from 'react';
import { ServiceType } from '../../../@types/types';

function ServicesTable3() {
	const { data: services, isLoading, isError } = useGetAllServices();
	// const { mutateAsync: updateService } = useUpdateService();

	const columns = useMemo<MRT_ColumnDef<ServiceType>[]>(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
			},
			{
				header: 'Titre',
				accessorKey: 'title', //simple recommended way to define a column
				//more column options can be added here to enable/disable features, customize look and feel, etc.
			},
		],
		[]
	);

	const table = useMantineReactTable({
		columns,
		data: services || [], //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
		// enableRowSelection: true, //enable some features
		enableGlobalFilter: true,
		enableColumnFilters: false,
		enableColumnActions: false,
		createDisplayMode: 'row',
		editDisplayMode: 'cell',
		enableHiding: false,
		enableDensityToggle: false,
		paginationDisplayMode: 'pages',
		initialState: {
			columnVisibility: {
				id: false, //hide id column by default
			},
		},
	});

	if (isLoading) {
		return <div>Chargement...</div>;
	}
	if (isError) {
		return <div>Erreur</div>;
	}

	return (
		<div className='services-table'>
			<MantineReactTable table={table} />
		</div>
	);
}

export default ServicesTable3;
