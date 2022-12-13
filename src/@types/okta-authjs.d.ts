import {
	AccessToken,
	IDToken,
	OAuthResponse,
	OktaAuth0AuthInterface,
	PopupParams,
	TokenParams,
	TokenResponse,
} from '@okta/okta-auth-js';

declare module '@okta/okta-auth-js' {
	declare function getToken(
		sdk: OktaAuth0AuthInterface,
		options: CustomTokenParams & PopupParams
	): Promise<TokenResponse>;

	declare function prepareTokenParams(
		sdk: OktaAuth0AuthInterface,
		tokenParams?: CustomTokenParams
	): Promise<TokenParams>;

	declare function handleOAuthResponse(
		sdk: OktaAuth0AuthInterface,
		tokenParams: CustomTokenParams,
		res: OAuthResponse,
		urls?: CustomUrls
	): Promise<TokenResponse>;

	function buildAuthorizeParams(tokenParams: CustomTokenParams): string;

	interface TokenAPI {
		getWithoutPrompt(params?: CustomTokenParams): Promise<TokenResponse>;
	}

	interface CustomTokenParams extends Omit<TokenParams, 'responseMode'> {
		responseMode?: 'fragment' | 'query' | 'form_post' | 'web_message';
		extraParams?: {
			audience?: string;
			subject_token?: string;
			subject?: string;
			[propName: string]: string;
		};
	}

	interface Tokens {
		impersonation_accessToken?: AccessToken;
		impersonation_idToken?: IDToken;
	}
}
export {};
