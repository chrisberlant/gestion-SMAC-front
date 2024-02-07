import { z } from 'zod';
import {
	deviceCreationSchema,
	deviceUpdateSchema,
} from '../validationSchemas/deviceSchemas';

export interface DeviceType {
	id: number;
	imei: string;
	preparationDate: string;
	attributionDate: string;
	status:
		| 'En stock'
		| 'Attribué'
		| 'Restitué'
		| 'En attente de restitution'
		| 'En prêt'
		| 'En panne'
		| 'Volé';
	isNew: boolean;
	comments: string | null;
	modelId: number;
	agentId: number | null;
}

export type DeviceCreationType = z.infer<typeof deviceCreationSchema>;

export type DeviceUpdateType = z.infer<typeof deviceUpdateSchema>;
