import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth';

export const useGetImpersonationTokenMutation = () => {
	const { getImpersonationToken } = useAuth();

	return useMutation({
		mutationFn: (subject: string) => getImpersonationToken(subject),
		mutationKey: ['auth', 'impersonation'],
		onSuccess: (data) => console.log(data),
	});
};
