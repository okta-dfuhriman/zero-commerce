import { useMutation } from '@tanstack/react-query';
import { useAuth0 } from '@auth0/auth0-react';

import type { LogoutOptions } from '@auth0/auth0-react';

export const useLogoutMutation = (options?: LogoutOptions) => {
	try {
		const { returnTo = window.location.origin } = options || {};

		const { logout } = useAuth0();

		const logoutFn = async (options?: LogoutOptions) =>
			logout({ ...options, returnTo });

		return useMutation(logoutFn, {
			mutationKey: ['auth', 'logout'],
		});
	} catch (error) {
		throw new Error('useLogoutMutation init error');
	}
};
