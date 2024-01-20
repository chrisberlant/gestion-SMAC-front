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

export interface LineType {
	id: number;
	number: string;
	profile: string;
	status: string;
	comments: string | null;
	agentId: number | null;
	agent: AgentType;
	deviceId: number | null;
	device: DeviceType;
}

export interface ModelType {
	id: number;
	brand: string;
	reference: string;
	storage?: string | null;
}

export interface AgentType {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	serviceId: number;
	service: ServiceType;
}

export interface DeviceType {
	id: number;
	imei: string;
	preparationDate?: Date | null;
	attributionDate?: Date | null;
	status: string;
	isNew: boolean;
	comments?: string | null;
	modeId: number;
	model: ModelType;
	agentId?: number | null;
	agent: AgentType | null;
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
