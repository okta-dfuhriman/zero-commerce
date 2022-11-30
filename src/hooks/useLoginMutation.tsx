import { useMutation } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';

import type { RedirectLoginOptions } from '@auth0/auth0-spa-js';

export const useLoginMutation = () => {
	try {
		const { loginWithRedirect } = useAuth0();

		return useMutation(
			(options?: RedirectLoginOptions) => loginWithRedirect(options),
			{
				mutationKey: ['auth', 'login'],
			}
		);
	} catch (error) {
		throw new Error('useLoginMutation init error');
	}
};
