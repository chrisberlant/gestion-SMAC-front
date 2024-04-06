export interface HistoryType {
	id: number;
	operation: 'Création' | 'Modification' | 'Suppression';
	table: 'agent' | 'device' | 'line' | 'model' | 'service' | 'user';
	content: string;
	createdAt: Date;
	userId: number;
}
