import type { Auth0ProviderOptions } from '@auth0/auth0-react';

const defaultRedirectUri = window.location.origin;

const {
	VITE_AUTH0_DOMAIN: domain,
	VITE_AUTH0_CACHE_LOCATION: cacheLocation,
	VITE_AUTH0_CLIENT_ID: clientId,
	VITE_AUTH0_REDIRECT_URI: redirectUri = defaultRedirectUri,
	VITE_AUTH0_SCOPES:
		scope = 'openid profile email offline_access idp:read idp:write demonstration:read demonstration:write',
	VITE_AUTH0_USE_REFRESH: useRefreshTokens = true,
	PROD: isProd,
} = import.meta.env;

export const getConfig = async (
	options?: Partial<Auth0ProviderOptions>
): Promise<Auth0ProviderOptions> => ({
	...options,
	cacheLocation: cacheLocation || isProd ? 'memory' : 'localstorage',
	clientId,
	domain,
	redirectUri,
	responseType: 'code',
	scope,
	useRefreshTokens,
});
