import { z } from 'zod';
import { modelCreationSchema } from '../validationSchemas/modelSchemas';

export type ModelType = {
	id: number;
	brand: string;
	reference: string;
	storage: string | null;
};

export type ModelCreationType = z.infer<typeof modelCreationSchema>;
