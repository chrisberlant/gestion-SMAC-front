export type AgentsAndDevicesPerServiceType = {
	service: string;
	agentsAmount: string;
	devicesAmount: string;
};
export type AgentsAndDevicesPerServiceWithNumberValuesType = {
	service: string;
	devicesAmount: number;
	agentsAmount: number;
};

export type DevicesAmountPerModelType = {
	brand: string;
	reference: string;
	storage: string;
	devicesAmount: string;
};

export type StatsType =
	| AgentsAndDevicesPerServiceType
	| DevicesAmountPerModelType;

export type ColumnOrderTableState = {
	columnOrder: ColumnOrderState;
};

export type ColumnOrderState = string[];
