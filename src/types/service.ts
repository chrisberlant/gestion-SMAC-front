import { z } from 'zod';
import { serviceCreationSchema } from '@validationSchemas/serviceSchemas';

export interface ServiceType {
	id: number;
	title: string;
}

export type ServiceCreationType = z.infer<typeof serviceCreationSchema>;
