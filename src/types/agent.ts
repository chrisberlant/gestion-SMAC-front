import { z } from 'zod';
import {
	agentCreationSchema,
	agentQuickCreationSchema,
	agentUpdateSchema,
} from '../validationSchemas/agentSchemas';

export interface AgentType {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	vip: boolean;
	serviceId: number;
	// devices: { id: number; imei: string }[];
}

export type AgentCreationType = z.infer<typeof agentCreationSchema>;
export type AgentUpdateType = z.infer<typeof agentUpdateSchema>;
export type AgentQuickCreationType = z.infer<typeof agentQuickCreationSchema>;
