import { useQuery } from '@tanstack/react-query';

import type { AuthClient } from 'providers';

export const useGetUserQuery = (authClient: AuthClient) => {
	try {
		return useQuery({
			queryKey: ['user'],
			queryFn: () => authClient.getUser(),
		});
	} catch (error) {
		console.error(error);
		throw new Error('useLoginMutation init error');
	}
};
