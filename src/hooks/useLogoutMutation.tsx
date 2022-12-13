import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';

import type { SignoutOptions } from '@okta/okta-auth-js';
import type { AuthClient } from 'providers/Auth/AuthClient';

export const useLogoutMutation = (
	authClient: AuthClient,
	options?: SignoutOptions
) => {
	try {
		const { postLogoutRedirectUri = window.location.origin } =
			options || {};

		const logoutFn = async (options?: SignoutOptions) =>
			authClient.signOut({ ...options, postLogoutRedirectUri });

		return useMutation(logoutFn, {
			mutationKey: ['auth', 'logout'],
		});
	} catch (error) {
		throw new Error('useLogoutMutation init error');
	}
};
