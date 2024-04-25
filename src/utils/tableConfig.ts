import { MRT_DensityState } from 'mantine-react-table';

// Paramètres utilisés dans les tableaux avec lignes virtualisées
export const virtualizedTableConfig = {
	enablePagination: false,
	enableRowVirtualization: true,
	enableGlobalFilter: true,
	enableColumnFilters: true,
	enableColumnOrdering: true,
	enableColumnActions: false,
	enableEditing: true,
	enableHiding: true,
	enableDensityToggle: false,
	mantineSearchTextInputProps: {
		placeholder: 'Rechercher',
		style: { minWidth: '300px' },
		variant: 'default',
	},
	mantineTableContainerProps: { style: { maxHeight: '60vh' } },
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
	createDisplayMode: 'row' as 'row' | 'custom' | 'modal' | undefined,
	editDisplayMode: 'row' as
		| 'row'
		| 'custom'
		| 'modal'
		| 'cell'
		| 'table'
		| undefined,
};

// Paramètres utilisés dans les tableaux paginés
export const paginatedTableConfig = {
	enableColumnActions: false,
	createDisplayMode: 'row' as 'row' | 'custom' | 'modal' | undefined,
	editDisplayMode: 'row' as
		| 'row'
		| 'custom'
		| 'modal'
		| 'cell'
		| 'table'
		| undefined,
	enableEditing: true,
	enableHiding: false,
	sortDescFirst: true,
	enableDensityToggle: false,
	mantineSearchTextInputProps: {
		placeholder: 'Rechercher',
		variant: 'default',
	},
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
	mantineTableContainerProps: { style: { minWidth: '40vw' } },
	mantinePaginationProps: {
		rowsPerPageOptions: ['5', '10', '20', '30'],
		withEdges: true,
	},
};
