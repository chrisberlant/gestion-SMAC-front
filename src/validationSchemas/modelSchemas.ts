import { z } from 'zod';

export const modelCreationSchema = z.strictObject({
	brand: z
		.string({
			required_error: 'La marque doit être renseignée',
			invalid_type_error: 'La marque doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'La marque doit être renseignée'),
	reference: z
		.string({
			required_error: 'Le modèle doit être renseigné',
			invalid_type_error: 'Le modèle doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le modèle doit être renseigné'),
	storage: z
		.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		})
		.or(z.literal(''))
		.nullable()
		.optional(),
});

export const modelUpdateSchema = z.strictObject({
	brand: z
		.string({
			invalid_type_error: 'La marque doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'La marque doit être renseignée')
		.optional(),
	reference: z
		.string({
			invalid_type_error: 'Le modèle doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le modèle doit être renseigné')
		.optional(),
	storage: z
		.string({
			invalid_type_error:
				'Le stockage doit être une chaîne de caractères',
		})
		.or(z.literal(''))
		.nullable()
		.optional(),
});
