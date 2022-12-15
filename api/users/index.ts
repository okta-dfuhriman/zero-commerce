import express from 'express';

import assert from 'assert';
import { Auth0Client } from '../_AuthClient';

import type { Request, Response, NextFunction } from 'express';
import type { GetUserOptions } from '../_AuthClient';

const {
	AUTH_MANAGEMENT_API_DOMAIN: domain,
	AUTH_CLIENT_ID: clientId,
	AUTH_CLIENT_SECRET: clientSecret,
	AUTH_API_AUDIENCE: audience,
} = process.env;

const app = express();

const withAuthClient = (req: Request, res: Response, next: NextFunction) => {
	assert.ok(domain, 'You must include the domain for your Auth0 tenant.');

	req.authClient = new Auth0Client({
		domain: domain!,
		clientId,
		clientSecret,
		audience,
	});

	next();
};

export const getUsers = async (req: Request, res: Response) => {
	const { params, authClient, query } = req;

	assert.ok(
		authClient,
		'Must initialize an AuthClient in order to call Auth0 API!'
	);

	if (params?.id) {
		let id = params.id;

		if (Array.isArray(id) && id.length === 1) {
			id = id[0];
		}

		assert.ok(
			typeof id === 'string',
			'Invalid Id. Must send a string identifier.'
		);

		let { includeRoles = false, includePermissions = false } =
			(query as GetUserOptions) || {};

		includeRoles =
			typeof includeRoles === 'boolean'
				? includeRoles
				: includeRoles === 'true';

		includePermissions =
			typeof includePermissions === 'boolean'
				? includePermissions
				: includePermissions === 'true';

		const user = await authClient?.getUserById(id as string, {
			includeRoles,
			includePermissions,
		});

		console.log(user);

		return res.json(user);
	}

	const users = (await authClient?.getUsers()) || [];

	console.log(users);

	return res.json(users);
};

// import type { UpdateUserData } from 'auth0';

// export const onRequestPatch: PagesFunction<Env> = async (context) => {
// 	const { env, params, data } = context || {};

// 	const {
// 		AUTH_MANAGEMENT_API_DOMAIN: domain,
// 		AUTH_CLIENT_ID: clientId,
// 		AUTH_CLIENT_SECRET: clientSecret,
// 		AUTH_API_AUDIENCE: audience,
// 	} = env;

// 	const authClient = new Auth0Client({
// 		domain,
// 		clientId,
// 		clientSecret,
// 		audience,
// 	});

// 	assert.ok(
// 		authClient,
// 		'Must initialize an AuthClient in order to call Auth0 API!'
// 	);
// 	assert.ok(params?.id, 'Must provide a `user_id`!');

// 	assert.ok(data, 'Must provide some data to update!');

// 	let id = params.id!;

// 	if (Array.isArray(id) && id.length === 1) {
// 		id = id[0];
// 	}

// 	assert.ok(
// 		typeof id === 'string',
// 		'Invalid Id. Must send a string identifier.'
// 	);

// 	const response = new Response(
// 		JSON.stringify(
// 			await authClient?.updateUser(
// 				{ id: id as string },
// 				data as UpdateUserData
// 			)
// 		)
// 	);

// 	response.headers.set('content-type', 'application/json');

// 	return response;
// };
app.use(withAuthClient);

app.get('/api/users', getUsers);
app.get('/api/users/:id', getUsers);

export default app;
