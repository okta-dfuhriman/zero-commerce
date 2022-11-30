import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

import { getConfig } from 'utils';
import { PageSpinner } from 'components';

import type { AppState, Auth0ProviderOptions, User } from '@auth0/auth0-react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const [config, setConfig] = React.useState<
		Auth0ProviderOptions | undefined
	>();

	React.useEffect(() => {
		const onRedirectCallback = (appState?: AppState, _?: User) =>
			navigate(appState?.returnTo || '/');

		if (!config) {
			getConfig({ onRedirectCallback }).then((_config) =>
				setConfig(_config)
			);
		}
	}, []);

	return config ? (
		<Auth0Provider {...{ ...config }}>{children}</Auth0Provider>
	) : (
		<PageSpinner />
	);
};
