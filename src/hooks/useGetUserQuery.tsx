import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useGetUserQuery = () => {
	try {
		const { authClient, isAuthenticated } = useAuth();

		const queryFn = async () => {
			if (isAuthenticated) {
				const user = await authClient.getUser();

				if (user?.headers) {
					delete user.headers;
				}

				return user;
			}
		};

		return useQuery({
			queryKey: ['user'],
			queryFn,
		});
	} catch (error) {
		console.error(error);
		throw new Error('useLoginMutation init error');
	}
};
