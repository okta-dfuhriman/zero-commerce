import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { AxiosRequestConfig } from 'axios';
import type { AuthClient } from 'providers';

const { VITE_BASE_API_URL: apiUrl } = import.meta.env;

export const useGetUsersQuery = (
	authClient: AuthClient,
	onSuccess?: Function
) => {
	try {
		const getUsersFn = async () => {
			if (await authClient.isAuthenticated()) {
				const options: AxiosRequestConfig = {
					method: 'GET',
					url: `${apiUrl}/users`,
					headers: {
						authorization: `Bearer ${authClient.getAccessToken()}`,
					},
				};

				const { data = [] } = (await axios(options)) as {
					data: User[];
				};

				const { sub } = await authClient.getUser();

				console.log(data);

				return data.filter((user) => {
					if (user?.user_id !== sub) {
						return user;
					}
				});
			}
		};

		return useQuery({
			queryKey: ['users'],
			queryFn: getUsersFn,
			onSuccess: (data) => {
				if (onSuccess) {
					onSuccess(data || []);
				}
			},
		});
	} catch (error) {
		console.error(error);
		throw new Error('useGetUsersQuery init error');
	}
};
