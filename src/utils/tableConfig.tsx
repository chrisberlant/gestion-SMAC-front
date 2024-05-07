import { Flex } from '@mantine/core';

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
	displayColumnDefOptions: {
		'mrt-row-actions': {
			size: 80,
		},
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
	renderEmptyRowsFallback: () => (
		<Flex
			justify='center'
			align='center'
			styles={{
				root: {
					fontStyle: 'italic',
					fontSize: 16,
					color: 'var(--mantine-color-dimmed)',
				},
			}}
		>
			Aucune donnée existante
		</Flex>
	),
};

// Paramètres utilisés dans les tableaux paginés (historique)
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
		rowsPerPageOptions: ['10', '20', '50', '100', '200'],
		withEdges: true,
	},
	renderEmptyRowsFallback: () => (
		<Flex
			justify='center'
			align='center'
			mih='80'
			styles={{
				root: {
					fontStyle: 'italic',
					fontSize: 16,
					color: 'var(--mantine-color-dimmed)',
				},
			}}
		>
			Aucune donnée existante
		</Flex>
	),
};
