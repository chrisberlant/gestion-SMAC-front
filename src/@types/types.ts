export interface UserType {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
}

export type LoggedUser = Omit<UserType, 'id'> | undefined;

export interface ServiceType {
	id: number;
	title: string;
}

export interface ModelType {
	id: number;
	brand: string;
	reference: string;
	storage?: string;
}

export interface DeviceType {
	id: number;
	imei: string;
	preparationDate: Date;
	attributionDate: Date;
	status: string;
	isNew: boolean;
	comments: string;
	modeId: number;
	model: ModelType;
	agentId: number;
	// TODO AgentType
}

export interface AgentsAndDevicesPerServiceType {
	service: string;
	agentsAmount: string;
	devicesAmount: string;
}

export interface DevicesAmountPerModelType {
	brand: string;
	reference: string;
	storage: string;
	devicesAmount: string;
}

export type StatsType =
	| AgentsAndDevicesPerServiceType
	| DevicesAmountPerModelType;
