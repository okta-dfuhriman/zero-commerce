import { ApiError, AssertionError } from './helpers';

interface Auth0Error {
	statusCode: number;
	error: string;
	message: string;
}

// Respond to OPTIONS method
export const onRequestOptions: PagesFunction = async () => {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Max-Age': '86400',
		},
	});
};

export const onRequest: PagesFunction<Env> = async (context) => {
	try {
		const response = await context.next();

		if (!response.ok || response?.status >= 400) {
			console.log('==== ~response.ok ====');
			console.error(response);
			throw response;
		}

		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Max-Age', '86400');

		return response;
	} catch (err: unknown) {
		let status = 500;
		let statusText = 'Internal error';
		let message: any = 'Unknown error';

		console.log('==== error ====');
		console.error(err);

		if (err instanceof ApiError) {
			status = err.statusCode || status;
			message = err?.message || message;
		}

		if (err instanceof Response) {
			const body = err?.body ? await err.json() : message;
			console.log(body);

			status = err?.status || status;
			statusText = err?.statusText || statusText;

			if (typeof body === 'string') {
				message = body;
			} else if ((body as Auth0Error)?.statusCode) {
				status = (body as Auth0Error)?.statusCode;
				statusText = (body as Auth0Error)?.error;
				message = (body as Auth0Error)?.message;
			} else {
				message = body;
			}
		} else {
			if (err instanceof Error) {
				message = err.toString();
			}

			if (err instanceof AssertionError) {
				const { actual, expected, message: _message } = err || {};
				status = 400;
				statusText = 'Assertion Error';

				message = {
					message: _message,
					actual,
					expected,
				};
			}
		}

		if (typeof message === 'object' && Object.keys(message)?.length > 0) {
			return new Response(JSON.stringify(message), {
				status,
				statusText,
				headers: { 'content-type': 'application/json' },
			});
		}

		return new Response(message, {
			status,
			statusText,
		});
	}
};
