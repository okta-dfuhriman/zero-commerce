import { ManagementClient } from 'auth0';
import assert from 'assert';

import type { ManagementClientOptions, UserData as Auth0UserData } from 'auth0';

export interface GetUserOptions {
	includeRoles?: boolean;
	includePermissions?: boolean;
}

interface UserData extends Auth0UserData {
	roles?: string[];
	permissions?: string[];
}

export class Auth0Client extends ManagementClient {
	domain: ManagementClientOptions['domain'];
	clientID: ManagementClientOptions['clientId'];
	clientSecret: ManagementClientOptions['clientSecret'];
	audience?: ManagementClientOptions['audience'];
	rootUrl: string;

	constructor(options: ManagementClientOptions) {
		const {
			domain,
			clientId,
			clientSecret,
			audience: _audience = '/api/v2/',
		} = options;

		assert.ok(clientId, "You must include your API application's clientId");
		assert.ok(
			clientSecret,
			"You must include your API application's clientSecret"
		);

		const audience = _audience.startsWith('/')
			? `https://${domain + _audience}`
			: _audience;

		super({ domain, clientId, clientSecret, audience });

		this.domain = domain;
		this.clientID = clientId;
		this.clientSecret = clientSecret;
		this.audience = audience;

		this.rootUrl = ['https://', this.domain, 'api/v2'].join('/');
	}

	async getUserById(id: string, options?: GetUserOptions) {
		assert.ok(id, 'A valid `user_id` must be provided.');

		const {
			includeRoles = false,
			includePermissions = false,
			..._options
		} = options || {};

		const userData = await this.getUser({ id });

		let user: UserData = {
			...userData,
		};

		if (includeRoles) {
			const roles = await this.getUserRoles({ id });

			user = {
				...user,
				roles: roles.map(({ name }) => name),
			} as UserData;
		}

		if (includePermissions) {
			const permissions = await this.getUserPermissions({ id });

			user = {
				...user,
				permissions: permissions.map(
					({ permission_name }) => permission_name
				),
			} as UserData;
		}

		return user;
	}
}
