import { z } from 'zod';

const fileImportSchema = z.strictObject({
	file: z
		.instanceof(File, { message: 'Aucun fichier renseigné' })
		.refine(
			(file) => file.type === 'text/csv',
			'Le fichier doit être au format csv'
		),
});

export default fileImportSchema;
