import { assert, Auth0Client, getUsers } from '../../_utils';

import type { UpdateUserData } from 'auth0';

export const onRequestGet = getUsers;

export const onRequestPatch: PagesFunction<Env> = async (context) => {
	const { env, params, data } = context || {};

	const {
		AUTH_MANAGEMENT_API_DOMAIN: domain,
		AUTH_CLIENT_ID: clientId,
		AUTH_CLIENT_SECRET: clientSecret,
		AUTH_API_AUDIENCE: audience,
	} = env;

	const authClient = new Auth0Client({
		domain,
		clientId,
		clientSecret,
		audience,
	});

	assert.ok(
		authClient,
		'Must initialize an AuthClient in order to call Auth0 API!'
	);
	assert.ok(params?.id, 'Must provide a `user_id`!');

	assert.ok(data, 'Must provide some data to update!');

	let id = params.id!;

	if (Array.isArray(id) && id.length === 1) {
		id = id[0];
	}

	assert.ok(
		typeof id === 'string',
		'Invalid Id. Must send a string identifier.'
	);

	const response = new Response(
		JSON.stringify(
			await authClient?.updateUser(id as string, data as UpdateUserData)
		)
	);

	response.headers.set('content-type', 'application/json');

	return response;
};
