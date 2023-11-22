export type LoggedUser = {
	email: string;
	firstName: string;
	lastName: string;
};

export type UserInterface = LoggedUser | undefined;

export interface UserType {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	isAdmin: boolean;
}

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

export interface AdminDashboardDataType {
	users: UserType[];
	services: ServiceType[];
	models: ModelType[];
}
