import { ApiError, AssertionError } from './helpers';

interface Auth0Error {
	statusCode: number;
	error: string;
	message: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
	try {
		const response = await context.next();

		if (!response.ok) {
			console.error({
				status: response?.status,
				statusText: response?.statusText,
			});
			throw response;
		}

		const { ALLOWED_ORIGINS } = context?.env || {};

		if (ALLOWED_ORIGINS) {
			response.headers.set(
				'access-control-allow-origin',
				ALLOWED_ORIGINS
			);
		}

		return response;
	} catch (err: unknown) {
		let status = 500;
		let statusText = 'Internal error';
		let message: any = 'Unknown error';

		try {
			console.error(JSON.stringify(err));
		} catch (_error) {
			console.error({ err, _error });
		}

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
