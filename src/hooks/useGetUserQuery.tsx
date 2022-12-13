import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useGetUserQuery = () => {
	try {
		const { authClient } = useAuth();

		return useQuery({
			queryKey: ['user'],
			queryFn: () => authClient.getUser(),
		});
	} catch (error) {
		console.error(error);
		throw new Error('useLoginMutation init error');
	}
};
