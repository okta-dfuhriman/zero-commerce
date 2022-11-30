import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import * as jose from 'jose';

import { AppStateReducer, initialAppState } from './AppStateReducer';
import { useLoginMutation } from 'hooks';

import type { RedirectLoginOptions } from '@auth0/auth0-spa-js';

const {} = import.meta.env;

export const AppStateContext = React.createContext(initialAppState);

const initializeState: AppState.Provider.StateInitializer = (state) => {
	if (!state?.app) {
		state = {
			...state,
			isLoading: {
				all: false,
			},
		};
	}

	return state;
};

export const AppStateProvider = ({ children }: AppState.Provider.Props) => {
	const [state, dispatch] = React.useReducer<
		React.Reducer<AppState.State, AppState.Reducer.Action>,
		AppState.InitialState
	>(AppStateReducer, initialAppState as AppState.State, initializeState);

	const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
	const { mutate: _login } = useLoginMutation();

	React.useEffect(() => {
		if (isAuthenticated) {
			getPermissions().then((permissions) =>
				dispatch({
					type: 'PERMISSIONS_FETCHED',
					payload: { permissions },
				})
			);
		}
	}, [isAuthenticated]);

	const getAccessToken = async () => {
		const accessToken = await getAccessTokenSilently();

		if (!accessToken) {
			throw new Error(
				'Unable to obtain access token. Please authenticate yourself.'
			);
		}

		return accessToken;
	};

	const getPermissions = async () => {
		const accessTokenString = await getAccessToken();

		const { scope } = jose.decodeJwt(accessTokenString);

		if (scope) {
			return scope.split(' ');
		}

		return [];
	};

	const login = (options: RedirectLoginOptions) => {
		dispatch({ type: 'LOGIN_STARTED' });

		_login(options);
	};

	const contextValue = React.useMemo(
		() => ({
			...state,
			dispatch,
			getAccessToken,
			getPermissions,
			login,
		}),
		[state]
	);

	return (
		<AppStateContext.Provider value={contextValue}>
			{children}
		</AppStateContext.Provider>
	);
};
