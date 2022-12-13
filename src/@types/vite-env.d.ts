/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_AUTH_DOMAIN?: string;
	readonly VITE_AUTH_ISSUER?: string;
	readonly VITE_AUTH_CLIENT_ID?: string;
	readonly VITE_AUTH_REDIRECT_URI?: string;
	readonly VITE_AUTH_SCOPES?: string;
	readonly VITE_AUTH_API_AUDIENCE?: string;
	readonly VITE_AUTH_TOKEN_AUTO_RENEW?: string;
	readonly VITE_AUTH_SERVICES_SYNC_STORAGE?: string;
	readonly VITE_AUTH_AUTHORIZE_URL?: string;
	readonly VITE_AUTH_LOGOUT_URL?: string;
	readonly VITE_AUTH_TOKEN_URL?: string;
	readonly VITE_AUTH_USERINFO_URL?: string;
}
