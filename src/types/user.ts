import { z } from 'zod';
import {
	currentUserPasswordUpdateSchema,
	currentUserUpdateSchema,
	userCreationSchema,
	userDeletionSchema,
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

export type UserDeletionType = z.infer<typeof userDeletionSchema>;

export type UserPasswordIsResetType = {
	fullName: string;
	email: string;
	generatedPassword: string;
};
