import { http, HttpResponse } from 'msw';
import { DeviceType } from '@customTypes/device';
import { AgentType } from '@customTypes/agent';
import { ModelType } from '@customTypes/model';
import { LineType } from '@customTypes/line';
import { UserType } from '@customTypes/user';
import { ServiceType } from '@customTypes/service';

export const apiUrl = process.env.VITE_API_URL;

export const handlers = [
	http.get(apiUrl + '/me', () =>
		HttpResponse.json(
			{
				email: 'chuck.norris@gmail.com',
				firstName: 'Chuck',
				lastName: 'Norris',
				role: 'Admin',
			},
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/services', () =>
		HttpResponse.json(
			[
				{ id: 1, title: 'first-service' },
				{ id: 2, title: 'second-service' },
			] as ServiceType[],
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/devices', () =>
		HttpResponse.json(
			[
				{
					id: 1,
					imei: '123321456654780',
					preparationDate: null,
					attributionDate: null,
					status: 'En stock',
					isNew: true,
					comments: null,
					agentId: 2,
					modelId: 1,
				},
				{
					id: 2,
					imei: '134321456654877',
					preparationDate: '2023-01-07',
					attributionDate: '2023-01-22',
					status: 'Attribué',
					isNew: false,
					comments: 'commentaire appareil 2',
					agentId: 1,
					modelId: 2,
				},
			] as DeviceType[],
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/agents', () =>
		HttpResponse.json(
			[
				{
					id: 1,
					email: 'john.smith@gmail.com',
					firstName: 'John',
					lastName: 'Smith',
					vip: false,
					serviceId: 2,
				},
				{
					id: 2,
					email: 'karen.taylor@gmail.com',
					firstName: 'Karen',
					lastName: 'Taylor',
					vip: true,
					serviceId: 1,
				},
			] as AgentType[],
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/models', () =>
		HttpResponse.json(
			[
				{
					id: 1,
					brand: 'Apple',
					reference: 'iPhone 15',
					storage: '256GB',
				},
				{
					id: 2,
					brand: 'Samsung',
					reference: 'S24',
					storage: null,
				},
			] as ModelType[],
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/lines', () =>
		HttpResponse.json(
			[
				{
					id: 1,
					number: '0123456789',
					profile: 'VD',
					status: 'Active',
					comments: 'commentaire ligne 1',
					agentId: 1,
					deviceId: 2,
				},
				{
					id: 2,
					number: '0987654321',
					profile: 'V',
					status: 'Résiliée',
					comments: null,
					agentId: 2,
					deviceId: 1,
				},
			] as LineType[],
			{ status: 200 }
		)
	),
	http.get(apiUrl + '/users', () =>
		HttpResponse.json(
			[
				{
					id: 1,
					email: 'super.administrator@gmail.com',
					firstName: 'Super',
					lastName: 'Administrator',
					role: 'Admin',
				},
				{
					id: 2,
					email: 'chuck.norris@gmail.com',
					firstName: 'Chuck',
					lastName: 'Norris',
					role: 'Tech',
				},
			] as UserType[],
			{ status: 200 }
		)
	),
];
