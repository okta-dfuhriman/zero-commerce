import type {
	ManagementClientOptions,
	Permission,
	Role,
	UpdateUserData,
	UserData as Auth0UserData,
} from 'auth0';

export interface ApiErrorInput {
	statusCode: number;
	statusText?: string;
	message?: string;
	stackTrace?: string;
}

export class ApiError extends Error {
	statusCode: ApiErrorInput['statusCode'];
	statusText?: ApiErrorInput['statusText'];
	stackTrace?: ApiErrorInput['stackTrace'];

	constructor(input: ApiErrorInput) {
		const { statusCode, statusText, message, stackTrace } = input || {};

		super(message);

		this.statusCode = statusCode || 500;
		this.statusText = statusText;
		this.stackTrace = stackTrace;
	}
}

export interface AssertionErrorOptions extends ErrorOptions {
	message?: string;
	actual?: any;
	expected?: any;
	operator?: string;
}

export class AssertionError extends Error {
	actual?: AssertionErrorOptions['actual'];
	expected?: AssertionErrorOptions['expected'];
	operator?: AssertionErrorOptions['operator'];
	generatedMessage?: boolean = true;
	code = 'ERR_ASSERTION';

	constructor(options: AssertionErrorOptions) {
		const { message, actual, expected, operator, cause } = options || {};

		super(message, { cause });

		this.actual = actual;
		this.expected = expected;
		this.operator = operator;
		this.generatedMessage = !message;
	}
}

const ok = (actual?: any, message?: string | Error) => {
	const expected = true;
	const failed = !!actual !== expected;

	if (message instanceof Error) {
		message = message.toString();
	}

	if (!message) {
		message =
			actual === undefined
				? 'No value argument passed to `assert.ok()`'
				: 'The expression evaluated to a falsy value';
	}

	if (failed) {
		throw new AssertionError({ actual, expected, message });
	}
};

export const assert = {
	ok,
};

interface HttpClientOptions
	extends Omit<RequestInit, 'redirect' | 'fetcher' | 'signal'> {
	url: string | URL;
}

interface GetAccessTokenResponse {
	access_token: string;
	token_type: 'Bearer';
}

export interface GetUserOptions {
	includeRoles?: boolean;
	includePermissions?: boolean;
}

interface UserData extends Auth0UserData {
	roles?: string[];
	permissions?: string[];
}

export class Auth0Client {
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
			audience = '/api/v2/',
		} = options;

		assert.ok(domain, 'You must include the domain for your Auth0 tenant.');
		assert.ok(clientId, "You must include your API application's clientId");
		assert.ok(
			clientSecret,
			"You must include your API application's clientSecret"
		);

		this.domain = domain;
		this.clientID = clientId;
		this.clientSecret = clientSecret;
		this.audience = audience;

		this.rootUrl = ['https://', this.domain, 'api/v2'].join('/');

		if (audience.startsWith('/')) {
			this.audience = `https://${domain + audience}`;
		}
	}

	async getAccessToken() {
		const url = `https://${this.domain}/oauth/token`;

		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				client_id: this.clientID,
				client_secret: this.clientSecret,
				audience: this.audience,
				grant_type: 'client_credentials',
			}),
		};

		const resp = await fetch(url, options);

		if (!resp.ok) {
			throw resp.clone();
			// const { status: statusCode = 401, statusText } = resp || {};
			// throw new ApiError({
			// 	statusCode,
			// 	statusText,
			// 	message: 'Unable to obtain management API authorization',
			// });
		}

		const { access_token } = (await resp.json()) as GetAccessTokenResponse;

		return access_token;
	}

	async httpClient(options: HttpClientOptions | string) {
		let headers = {
			'content-type': 'application/json',
			authorization: `Bearer ${await this.getAccessToken()}`,
		};

		let url: string;
		let init = {};

		if (typeof options !== 'string') {
			const { headers: _headers, url: _url, ..._init } = options || {};

			headers = {
				...headers,
				..._headers,
			};

			url = _url instanceof URL ? _url.toString() : _url;

			init = _init;
		} else {
			url = options;
		}

		if (url.startsWith('/')) {
			url = this.rootUrl + url;
		}

		const _options = {
			method: 'GET',
			headers,
			...init,
		} as RequestInit<RequestInitCfProperties>;

		const resp = await fetch(url, _options);

		if (!resp.ok || resp?.status >= 400) {
			const _resp = resp.clone();
			console.log('=== httpClient ===');
			console.error(_resp);
			throw _resp;
		}

		return resp;
	}

	async getUser(id: string, options?: GetUserOptions) {
		assert.ok(id, 'A valid `user_id` must be provided.');

		const { includeRoles = false, includePermissions = false } =
			options || {};

		const resp = await this.httpClient(`/users/${id}`);

		let user = (await resp.json()) as UserData;

		if (includeRoles) {
			user = {
				...user,
				roles: await this.getUserRoles(id),
			} as UserData;
		}

		if (includePermissions) {
			user = {
				...user,
				permissions: await this.getUserPermissions(id),
			} as UserData;
		}

		return user;
	}

	async getUsers() {
		const resp = await this.httpClient('/users');
		console.log('=== getUsers ===');

		const _resp = resp.clone();
		console.log(_resp);

		const contentType = resp.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			return (await resp.json()) as UserData[];
		} else if (contentType?.includes('text')) {
			return resp.text;
		} else {
			throw _resp;
		}
	}

	async getUserRoles(id: string) {
		const resp = await this.httpClient(`/users/${id}/roles`);

		const roles = ((await resp.json()) as Role[]) || [];

		return roles.map(({ name }) => name);
	}

	async getUserPermissions(id: string) {
		const resp = await this.httpClient(`/users/${id}/permissions`);

		const permissions = (await resp.json()) as Permission[];

		return permissions.map(({ permission_name }) => permission_name);
	}

	async updateUser(id: string, data: UpdateUserData) {
		const resp = await this.httpClient({
			method: 'PATCH',
			url: `/users/${id}`,
			body: JSON.stringify(data),
		});

		return (await resp.json()) as UserData;
	}
}

export const getUsers: PagesFunction<Env> = async (context) => {
	const { env, params, request } = context || {};

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

	let response: Response;

	if (params?.id) {
		let id = params.id;

		if (Array.isArray(id) && id.length === 1) {
			id = id[0];
		}

		assert.ok(
			typeof id === 'string',
			'Invalid Id. Must send a string identifier.'
		);

		const url = new URL(request?.url);

		const options = {
			includeRoles: false,
			includePermissions: false,
		} as GetUserOptions;

		if (url?.searchParams.has('includeRoles')) {
			let includeRoles = url.searchParams.get('includeRoles');

			options.includeRoles =
				typeof includeRoles === 'boolean'
					? includeRoles
					: includeRoles === 'true';
		}

		if (url?.searchParams.has('includePermissions')) {
			let includePermissions = url.searchParams.get('includePermissions');

			options.includePermissions =
				typeof includePermissions === 'boolean'
					? includePermissions
					: includePermissions === 'true';
		}

		const user = await authClient?.getUser(id as string, options);

		console.log(user);

		response = new Response(JSON.stringify(user));
	} else {
		const users = (await authClient?.getUsers()) || [];

		console.log(users);

		response = new Response(JSON.stringify(users));
	}

	response.headers.set('content-type', 'application/json');

	return response;
};
