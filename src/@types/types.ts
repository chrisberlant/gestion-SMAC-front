export type LoggedUser = {
	email: string;
	firstName: string;
	lastName: string;
};

export type UserInterface = LoggedUser | undefined;
