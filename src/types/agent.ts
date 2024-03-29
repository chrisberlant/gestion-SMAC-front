import { z } from 'zod';
import { agentCreationSchema } from '../validationSchemas/agentSchemas';

export interface AgentType {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	vip: boolean;
	serviceId: number;
	devices: { id: number; imei: string }[];
}

export type AgentCreationType = z.infer<typeof agentCreationSchema>;
