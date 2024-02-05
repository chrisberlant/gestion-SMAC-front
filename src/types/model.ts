import { z } from 'zod';
import {
	modelCreationSchema,
	modelUpdateSchema,
} from '../validationSchemas/modelSchemas';

export type ModelType = {
	id: number;
	brand: string;
	reference: string;
	storage: string | null;
};

export type ModelCreationType = z.infer<typeof modelCreationSchema>;

export type ModelUpdateType = z.infer<typeof modelUpdateSchema>;
