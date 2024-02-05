import { z } from 'zod';
import {
	serviceCreationSchema,
	serviceUpdateSchema,
} from '../validationSchemas/serviceSchemas';

export interface ServiceType {
	id: number;
	title: string;
}

export type ServiceCreationType = z.infer<typeof serviceCreationSchema>;

export type ServiceUpdateType = z.infer<typeof serviceUpdateSchema>;
