export interface UserType {
	id?: number;
	email: string;
	firstName: string;
	lastName: string;
	role: 'Admin' | 'Tech' | 'Consultant';
}

export type LoggedUser = Omit<UserType, 'id'> | undefined;

export interface ServiceType {
	id?: number;
	title: string;
}

export interface LineType {
	id?: number;
	number: string;
	profile: 'V' | 'D' | 'VD';
	status: 'Active' | 'En cours' | 'Résiliée';
	comments: string | null;
	agentId: number | null;
	agent: AgentType;
	deviceId: number | null;
}

export interface ModelType {
	id: number;
	brand: string;
	reference: string;
	storage?: string | null;
}

export interface AgentType {
	id?: number;
	email: string;
	firstName: string;
	lastName: string;
	vip: boolean;
	serviceId: number;
	devices?: { id: number }[];
}

export interface DeviceType {
	id?: number;
	imei: string;
	preparationDate?: Date | null;
	attributionDate?: Date | null;
	status:
		| 'En stock'
		| 'Attribué'
		| 'Restitué'
		| 'En attente de restitution'
		| 'En prêt'
		| 'En panne'
		| 'Volé';
	isNew: boolean;
	comments?: string | null;
	modelId: number;
	agentId?: number | null;
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
