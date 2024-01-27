import { z } from 'zod';

export const agentCreationSchema = z.strictObject({
	email: z
		.string({
			required_error: "L'adresse mail doit être renseignée",
			invalid_type_error: "Le format de l'adresse mail est incorrect",
		})
		.email("Le format de l'adresse mail est incorrect"),
	lastName: z.string({
		required_error: 'Le nom de famille doit être renseigné',
		invalid_type_error:
			'Le nom de famille doit être une chaîne de caractères',
	}),
	firstName: z.string({
		required_error: 'Le prénom doit être renseigné',
		invalid_type_error: 'Le prénom doit être une chaîne de caractères',
	}),
	vip: z.boolean({
		required_error: 'Le statut vip doit être renseigné',
		invalid_type_error: 'Le statut vip doit être un booléen',
	}),
	serviceId: z
		.number({
			required_error: 'Le service doit être renseigné',
			invalid_type_error: "L'id du service doit être un nombre",
		})
		.int("L'id du service doit être un nombre entier")
		.positive("L'id du service fourni est incorrect"),
});

export const agentUpdateSchema = z.strictObject({
	id: z
		.number({
			required_error: "L'id doit être renseigné",
			invalid_type_error: "L'id doit être un nombre",
		})
		.int("L'id doit être un nombre entier")
		.positive("L'id fourni est incorrect"),
	email: z
		.string({
			invalid_type_error: "Le format de l'adresse mail est incorrect",
		})
		.trim()
		.min(1, "L'adresse mail doit être renseignée")
		.email("Le format de l'adresse mail est incorrect")
		.optional(),
	lastName: z
		.string({
			invalid_type_error:
				'Le nom de famille doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le nom de famille doit être renseigné')
		.optional(),
	firstName: z
		.string({
			invalid_type_error: 'Le prénom doit être une chaîne de caractères',
		})
		.trim()
		.min(1, 'Le prénom doit être renseigné')
		.optional(),
	vip: z
		.boolean({
			invalid_type_error: 'Le statut vip doit être un booléen',
		})
		.optional(),
	serviceId: z
		.number({
			invalid_type_error: "L'id du service doit être un nombre",
		})
		.int("L'id du service doit être un nombre entier")
		.positive("L'id du service fourni est incorrect")
		.optional(),
});
