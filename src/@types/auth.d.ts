import type {
	AccessToken,
	CustomTokenParams,
	CustomUserClaims,
	OktaAuth,
	OktaAuthOptions,
	SigninWithRedirectOptions,
	SignoutOptions,
} from '@okta/okta-auth-js';

import { AuthClient } from '../providers/Auth/AuthClient';

declare global {
	namespace Auth {
		namespace Client {
			interface Options extends OktaAuthOptions {
				audience?: string | string[];
			}
		}

		interface Context extends Auth.State {}

		type OnAuthRequired = (authClient: Auth.Client) => Promise<void> | void;

		namespace Provider {
			interface Options {
				children?: React.ReactElement;
				authClient: AuthClient;
			}
		}

		namespace Reducer {
			interface Action extends Partial<Auth.State> {
				type: ActionType;
			}

			type ActionType =
				| 'AUTH_STATE_UPDATED'
				| 'ERROR'
				| 'GET_IMPERSONATION_TOKENS_COMPLETE'
				| 'GET_TOKENS_WITHOUT_PROMPT_STARTED'
				| 'IMPERSONATION_TOKENS_CLEARED'
				| 'HANDLING_LOGIN_REDIRECT'
				| 'INITIALIZED'
				| 'LOGIN_COMPLETE'
				| 'LOGIN_STARTED'
				| 'LOGOUT_COMPLETE'
				| 'LOGOUT_STARTED';
		}

		interface State {
			authClient: AuthClient;
			isAuthenticated: boolean;
			isLoading: boolean;
			isLoadingLogout: boolean;
			isInitialized: boolean;
			error?: any;
			impersonation_accessToken?: AccessToken;
			clearImpersonationTokens: () => void;
			getImpersonationToken: (subject: string) => Promise<void>;
			getPermissions: () => Promise<string[]>;
			login: (options?: SigninWithRedirectOptions) => void;
			logout: (options?: SignoutOptions) => void;
		}

		type InitialState = Omit<Auth.State, 'authClient' | 'user'>;
	}

	namespace User {
		interface Claims<T extends CustomUserClaims = CustomUserClaims> {
			auth_time?: number;
			aud?: string;
			email?: string;
			email_verified?: boolean;
			exp?: number;
			family_name?: string;
			given_name?: string;
			iat?: number;
			iss?: string;
			jti?: string;
			locale?: string;
			name?: string;
			nonce?: string;
			preferred_username?: string;
			sub: string;
			updated_at?: number;
			ver?: number;
			zoneinfo?: string;
			at_hash?: string;
			acr?: string;
			picture?: string;
		}
	}
}

export {};
