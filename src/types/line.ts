import { z } from 'zod';
import { lineCreationSchema } from '../validationSchemas/lineSchemas';

export type LineType = {
	id: number;
	number: string;
	profile: 'V' | 'D' | 'VD';
	status: 'Active' | 'En cours' | 'Résiliée';
	comments: string | null;
	agentId: number | null;
	deviceId: number | null;
};

export type LineCreationType = z.infer<typeof lineCreationSchema>;
