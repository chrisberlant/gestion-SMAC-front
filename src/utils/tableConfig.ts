import { MRT_DensityState } from 'mantine-react-table';

// Paramètres utilisés dans tous les tableaux
const tableConfig = {
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
	initialState: {
		density: 'xs' as MRT_DensityState,
		columnVisibility: {
			id: false,
		},
	},
};

export default tableConfig;
