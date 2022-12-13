import { useEffect, useMemo, useReducer, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
	CustomTokenParams,
	buildAuthorizeParams,
	getOAuthUrls,
	handleOAuthResponse,
	loadFrame,
	OAuthResponse,
	prepareTokenParams,
} from '@okta/okta-auth-js';

import type { AuthState, Token, Tokens } from '@okta/okta-auth-js';

import { PageSpinner } from 'components';
import { AuthContext } from './AuthContext';
import { AuthReducer } from './AuthReducer';
import { initialAuthState } from './AuthState';
import { useLoginMutation, useLogoutMutation } from 'hooks';

export const AuthProvider = ({
	authClient,
	children,
}: Auth.Provider.Options) => {
	const queryClient = useQueryClient();

	if (!authClient) {
		throw new Error('You must provide an initialized AuthClient.');
	}

	const [authState] = useState(() => {
		if (!authClient) {
			return initialAuthState;
		}

		return {
			...initialAuthState,
			...authClient.authStateManager.getAuthState(),
		};
	});

	const [state, dispatch] = useReducer<
		React.Reducer<Auth.State, Auth.Reducer.Action>,
		Auth.InitialState
	>(
		AuthReducer,
		{ ...authState, authClient } as Auth.State,
		(_authState) => _authState
	);

	const [tokens, setTokens] = useState<Tokens | undefined>();
	const [tokenParams, setTokenParams] = useState<
		CustomTokenParams | undefined
	>();
	const [authorizeUrl, setAuthorizeUrl] = useState<string | undefined>();
	const [iframeEl, setIframeEl] = useState<HTMLIFrameElement | undefined>();

	const { mutate: _login, isLoading: _isLoadingLogin } =
		useLoginMutation(authClient);
	const { mutate: _logout, isLoading: _isLoadingLogout } =
		useLogoutMutation(authClient);

	useEffect(() => {
		const handleLoginRedirect = async () => {
			const result = await authClient.handleRedirect();

			if (result !== false) {
				return await authClient.getUser();
			}
		};

		if (authClient.isLoginRedirect()) {
			dispatch({ type: 'HANDLING_LOGIN_REDIRECT' });

			handleLoginRedirect()
				.then((user) => {
					if (user) {
						queryClient.setQueryData(['user'], user);
					}

					dispatch({ type: 'LOGIN_COMPLETE' });
				})
				.catch((error) => dispatch({ type: 'ERROR', error }));
		}
	}, [window.location]);

	useEffect(() => {
		const handler = (_authState: AuthState) =>
			dispatch({ type: 'AUTH_STATE_UPDATED', ..._authState });

		if (authClient) {
			if (authClient?.authStateManager) {
				authClient.authStateManager.subscribe(handler);
			}

			// Trigger an initial change event to make sure authState is latest
			if (!authClient.isLoginRedirect()) {
				// Calculates initial auth state and fires change event for listeners
				// Also starts the token auto-renew service
				authClient.start();
			}

			dispatch({ type: 'INITIALIZED' });
		}

		return () => {
			authClient?.authStateManager?.unsubscribe(handler);
			authClient.stop();
		};
	}, [authClient]);

	useEffect(() => {
		if (state?.isLoading !== _isLoadingLogin) {
			dispatch({
				type: 'AUTH_STATE_UPDATED',
				isLoading: _isLoadingLogin,
			});
		}
	}, [_isLoadingLogin]);

	useEffect(() => {
		if (state?.isLoadingLogout !== _isLoadingLogin) {
			dispatch({
				type: 'AUTH_STATE_UPDATED',
				isLoading: _isLoadingLogin,
			});
		}
	}, [_isLoadingLogin]);

	useEffect(() => {
		const handler = async ({ origin, data }: MessageEvent<any>) => {
			const issuer = authClient.getIssuerOrigin();

			if (
				!tokenParams ||
				(origin !== issuer &&
					data?.type !== 'authorization_response' &&
					data?.response?.state !== tokenParams?.state)
			) {
				return;
			}

			const { tokens: _tokens } = await handleOAuthResponse(
				authClient,
				tokenParams,
				data?.response as OAuthResponse
			);

			console.log(_tokens);

			if (_tokens) {
				setAuthorizeUrl(undefined);
				setTokens(_tokens);

				if (iframeEl && document.body.contains(iframeEl)) {
					iframeEl.parentElement?.removeChild(iframeEl);
				}
			}
		};

		if (tokenParams && authorizeUrl) {
			window.addEventListener('message', handler);

			setIframeEl(loadFrame(authorizeUrl));
		}

		const resolver = () => {
			if (iframeEl && document.body.contains(iframeEl)) {
				iframeEl.parentElement?.removeChild(iframeEl);
			}

			window.removeEventListener('message', handler);
		};

		return resolver;
	}, [authorizeUrl, tokenParams]);

	useEffect(() => {
		if (tokens) {
			const _tokens = {
				...tokens,
			};
			setTokens(undefined);

			for (const [key, value] of Object.entries<Token>(_tokens as any)) {
				authClient.tokenManager.add(`impersonation_${key}`, value);
			}

			// authClient.authStateManager.updateAuthState();

			dispatch({
				type: 'GET_IMPERSONATION_TOKENS_COMPLETE',
				impersonation_accessToken: _tokens?.accessToken,
			});
		}
	}, [tokens]);

	const getImpersonationToken = async (subject: string) => {
		const extraParams: CustomTokenParams['extraParams'] = {
			subject,
			audience: authClient!.audience!.join(' '),
		};

		return await _getTokensWithoutPrompt({ extraParams });
	};

	const _getTokensWithoutPrompt = async (options?: CustomTokenParams) => {
		try {
			dispatch({ type: 'GET_TOKENS_WITHOUT_PROMPT_STARTED' });
			const overrides: CustomTokenParams = {
				prompt: 'none',
				responseMode: 'web_message',
			};

			options = {
				...options,
				...overrides,
			};

			let tokenParams = (await prepareTokenParams(
				authClient,
				options
			)) as CustomTokenParams;

			if (tokenParams) {
				tokenParams = {
					...tokenParams,
					...overrides,
				};

				setTokenParams(tokenParams);

				const urls = getOAuthUrls(authClient, tokenParams);

				const requestUrl =
					urls?.authorizeUrl + buildAuthorizeParams(tokenParams);

				if (requestUrl) {
					setAuthorizeUrl(requestUrl);
				}
			}
		} catch (err: unknown) {}
	};

	const getPermissions: Auth.State['getPermissions'] = async () => {
		const accessToken = authClient.getAccessToken();

		if (accessToken) {
			const { payload: claims } = authClient.token.decode(accessToken);

			const permissions = claims?.permissions as string | string[];

			if (permissions && Array.isArray(permissions)) {
				return permissions;
			}

			if (permissions && !Array.isArray(permissions)) {
				return permissions.split(' ');
			}
		}
		return [];
	};

	const clearImpersonationTokens = () => {
		authClient.tokenManager.remove('impersonation_accessToken');
		authClient.tokenManager.remove('impersonation_idToken');

		dispatch({ type: 'IMPERSONATION_TOKENS_CLEARED' });
	};

	const login: Auth.State['login'] = (options) => {
		dispatch({ type: 'LOGIN_STARTED' });

		_login(options);
	};

	const logout: Auth.State['logout'] = (options) => {
		dispatch({ type: 'LOGOUT_STARTED' });

		_logout(options);
	};

	const contextValue = useMemo<Partial<Auth.Context>>(
		() => ({
			...state,
			clearImpersonationTokens,
			getImpersonationToken,
			getPermissions,
			login,
			logout,
		}),
		[state]
	) as Auth.Context;

	return authClient ? (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	) : (
		<PageSpinner />
	);
};
