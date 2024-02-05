import { z } from 'zod';
import selectionSchema from '../validationSchemas';

export type IdSelectionType = z.infer<typeof selectionSchema>;

export type AgentsAndDevicesPerServiceType = {
	service: string;
	agentsAmount: string;
	devicesAmount: string;
};

export type DevicesAmountPerModelType = {
	brand: string;
	reference: string;
	storage: string;
	devicesAmount: string;
};

export type StatsType =
	| AgentsAndDevicesPerServiceType
	| DevicesAmountPerModelType;
