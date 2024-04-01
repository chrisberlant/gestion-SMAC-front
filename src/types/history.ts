export interface HistoryType {
	id: number;
	operation: 'Create' | 'Update' | 'Delete';
	table: 'agent' | 'device' | 'line' | 'model' | 'service' | 'user';
	content: string;
	createdAt: Date;
	userId: number;
}
