import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import type { AuthClient } from 'providers';
import type { AxiosRequestConfig } from 'axios';
import type { UserData } from 'auth0';

const { VITE_BASE_API_URL: apiUrl = `${window.location.origin}/api` } =
	import.meta.env;

export const useSomethingApi = (
	authClient: AuthClient,
	_method: 'GET' | 'POST' = 'GET'
) => {
	const somethingApi = async (
		id: string,
		method: 'GET' | 'POST' = _method,
		add = true
	) => {
		const options: AxiosRequestConfig = {
			method,
			url: `${apiUrl}/something/${id}`,
			headers: {
				authorization: `Bearer ${authClient.getAccessToken()}`,
			},
		};

		if (method === 'POST') {
			options['data'] = { add };
		}

		const { data } = (await axios(options)) as { data: UserData };

		return data;
	};

	return useMutation(somethingApi, {
		mutationKey: ['something', 'do'],
	});
};
