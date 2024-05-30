import { z } from 'zod';
import {
	currentUserPasswordUpdateSchema,
	currentUserUpdateSchema,
	userCreationSchema,
	userLoginSchema,
	userUpdateSchema,
} from '../validationSchemas/userSchemas';

export type UserType = {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	role: 'Admin' | 'Tech' | 'Consultant';
};

export type LoggedUserType = Omit<UserType, 'id'>;

export type UserInfosWithoutRoleType = Omit<UserType, 'role'>;

export type UserLoginType = z.infer<typeof userLoginSchema>;

export type CurrentUserUpdateType = z.infer<typeof currentUserUpdateSchema>;

export type CurrentUserPasswordUpdateType = z.infer<
	typeof currentUserPasswordUpdateSchema
>;

export type UserCreationType = z.infer<typeof userCreationSchema>;
export type UserUpdateType = z.infer<typeof userUpdateSchema>;

export type UserInfosAndPasswordType = {
	fullName: string;
	email: string;
	generatedPassword: string;
};

export type UserCredentialsType = {
	email: string;
	password: string;
};
