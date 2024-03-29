export type AgentsAndDevicesPerServiceType = {
	service: string;
	agentsAmount: string;
	devicesAmount: string;
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
