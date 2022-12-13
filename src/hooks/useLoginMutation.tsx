import { useMutation } from '@tanstack/react-query';

import type {
	SigninWithRedirectOptions,
	TokenParams,
} from '@okta/okta-auth-js';
import type { AuthClient } from 'providers';

export const useLoginMutation = (authClient: AuthClient) => {
	try {
		const audience = authClient?.audience || [];

		let extraParams: TokenParams['extraParams'] = {};

		if (audience?.length > 0) {
			extraParams['audience'] = audience.join(' ');
		}

		return useMutation(
			(options?: SigninWithRedirectOptions) =>
				authClient?.signInWithRedirect({ extraParams, ...options }),
			{
				mutationKey: ['auth', 'login'],
			}
		);
	} catch (error) {
		console.error(error);
		throw new Error('useLoginMutation init error');
	}
};
