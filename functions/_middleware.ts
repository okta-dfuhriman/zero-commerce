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
			console.error(JSON.stringify(response));
			throw response;
		}

		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Max-Age', '86400');

		return response;
	} catch (err: unknown) {
		let status = 500;
		let statusText = 'Internal error';
		let message: any = 'Unknown error';
		let details: any;

		console.log('==== error ====');
		console.error(err);
		console.error(JSON.stringify(err));

		if (err instanceof ApiError) {
			status = err.statusCode || status;
			message = err?.message || message;
			details = err?.details || {};
		}

		if (err instanceof Response) {
			const body =
				err?.body && !err?.bodyUsed ? await err.json() : message;
			console.log(body);

			status = err?.status || status;
			statusText = err?.statusText || statusText;

			if ((body as Auth0Error)?.statusCode) {
				status = (body as Auth0Error)?.statusCode;
				statusText = (body as Auth0Error)?.error;
				message = (body as Auth0Error)?.message;
			} else {
				message = body;
			}
		} else {
			if (err instanceof Error) {
				message = err?.message;
			}

			if (err instanceof AssertionError) {
				const { actual, expected, message: _message } = err || {};
				status = 400;
				statusText = 'Assertion Error';
				message = _message;
				details = {
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

		if (status >= 400) {
			return new Response(message, {
				status,
				statusText,
			});
		}

		return new Response(undefined, { status, statusText });
	}
};
