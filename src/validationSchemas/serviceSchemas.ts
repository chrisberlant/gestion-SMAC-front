import { z } from 'zod';

export const serviceCreationSchema = z.strictObject({
	title: z
		.string({
			required_error: 'Le titre doit être renseigné',
			invalid_type_error: 'Le titre doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le titre doit être renseigné'),
});

export const serviceUpdateSchema = z.strictObject({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id doit être un nombre entier")
		.positive("L'id fourni est incorrect"),
	title: z
		.string({
			required_error: 'Le titre doit être renseigné',
			invalid_type_error: 'Le titre doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le titre doit être renseigné'),
});
