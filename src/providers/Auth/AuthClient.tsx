import OktaAuth, {
	AuthSdkError,
	clone,
	getToken,
	parseFromUrl,
	prepareTokenParams,
	buildAuthorizeParams,
	getOAuthUrls,
	loadFrame,
	handleOAuthResponse,
} from '@okta/okta-auth-js';

import type {
	CustomUrls,
	CustomTokenParams,
	PopupParams,
	TokenParams,
	TokenResponse,
	Token,
	Tokens,
	OAuthResponse,
} from '@okta/okta-auth-js';

const {
	VITE_AUTH_DOMAIN: AUTH_DOMAIN,
	VITE_AUTH_ISSUER: AUTH_ISSUER,
	VITE_AUTH_CLIENT_ID: CLIENT_ID,
	VITE_AUTH_REDIRECT_URI: REDIRECT_URI,
	VITE_AUTH_SCOPES: SCOPES = 'openid profile email',
	VITE_AUTH_API_AUDIENCE: AUDIENCE,
	VITE_AUTH_TOKEN_AUTO_RENEW: AUTO_RENEW = true,
	VITE_AUTH_SERVICES_SYNC_STORAGE: SYNC_STORAGE = false,
	VITE_AUTH_AUTHORIZE_URL: AUTHORIZE_URL,
	VITE_AUTH_TOKEN_URL: TOKEN_URL,
	VITE_AUTH_USERINFO_URL: USERINFO_URL,
	MODE = 'dev',
} = import.meta.env;

const getAuthUrls = (urls: CustomUrls) => {
	let { issuer } = urls;

	if (issuer?.endsWith('/')) {
		issuer = issuer.slice(0, -1);
	}

	for (const [key, value] of Object.entries(urls)) {
		if (value.startsWith('/')) {
			urls[key as keyof CustomUrls] = issuer + value;
		}
	}

	return { ...urls, issuer };
};

export class AuthClient extends OktaAuth {
	config: Auth.Client.Options;
	audience?: string[];

	constructor(options?: Auth.Client.Options) {
		let {
			issuer: _issuer = AUTH_ISSUER,
			clientId = CLIENT_ID,
			redirectUri = REDIRECT_URI,
			scopes = SCOPES,
			devMode = MODE !== 'production',
			services,
			audience = AUDIENCE,
			authorizeUrl: _authorizeUrl = AUTHORIZE_URL,
			tokenUrl: _tokenUrl = TOKEN_URL,
			userinfoUrl: _userinforUrl = USERINFO_URL,
		} = options || {};

		if (!Array.isArray(scopes)) {
			if (scopes.includes(',')) {
				scopes = scopes.split(',');
			} else {
				scopes = scopes.split(' ');
			}
		}

		const { issuer, authorizeUrl, tokenUrl, userinfoUrl } = getAuthUrls({
			issuer: _issuer,
			authorizeUrl: _authorizeUrl,
			tokenUrl: _tokenUrl,
			userinfoUrl: _userinforUrl,
		});

		const {
			autoRenew = AUTO_RENEW || AUTO_RENEW === 'true',
			syncStorage = SYNC_STORAGE || SYNC_STORAGE === 'true',
		} = services || {};

		const authOptions: Auth.Client.Options = {
			issuer,
			authorizeUrl,
			tokenUrl,
			userinfoUrl,
			clientId,
			redirectUri,
			scopes,
			devMode,
			services: {
				...services,
				autoRenew: autoRenew as boolean,
				syncStorage: syncStorage as boolean,
			},
		};

		super(authOptions);

		this.setHeaders({
			'X-Okta-User-Agent-Extended': undefined,
		});

		if (audience && Array.isArray(audience)) {
			this.audience = audience;
		} else if (audience) {
			if (audience.includes(',')) {
				this.audience = audience.split(',');
			} else {
				this.audience = audience.split(' ');
			}
		}

		this.config = authOptions;
	}

	async checkSession(): Promise<void> {
		await this.isAuthenticated();
	}

	_getWithoutPrompt(options: CustomTokenParams): Promise<TokenResponse> {
		options = clone(options) || {};
		Object.assign(options, {
			prompt: 'none',
			responseMode: 'web_message',
			display: null,
		});
		return this._getToken(options);
	}

	/*
	 * Retrieve an idToken from an Okta or a third party idp
	 *
	 * Two main flows:
	 *
	 *  1) Exchange a sessionToken for a token
	 *
	 *    Required:
	 *      clientId: passed via the OktaAuth constructor or into getToken
	 *      sessionToken: 'yourtoken'
	 *
	 *    Optional:
	 *      redirectUri: defaults to window.location.href
	 *      scopes: defaults to ['openid', 'email']
	 *
	 *    Forced:
	 *      prompt: 'none'
	 *      responseMode: 'web_post_message'
	 *      display: undefined
	 *
	 *  2) Get a token from an idp
	 *
	 *    Required:
	 *      clientId: passed via the OktaAuth constructor or into getToken
	 *
	 *    Optional:
	 *      redirectUri: defaults to window.location.href
	 *      scopes: defaults to ['openid', 'email']
	 *      idp: defaults to Okta as an idp
	 *      prompt: no default. Pass 'none' to throw an error if user is not signed in
	 *
	 *    Forced:
	 *      display: 'popup'
	 *
	 *  Only common optional params shown. Any OAuth parameters not explicitly forced are available to override
	 *
	 * @param {Object} oauthOptions
	 * @param {String} [oauthOptions.clientId] ID of this client
	 * @param {String} [oauthOptions.redirectUri] URI that the iframe or popup will go to once authenticated
	 * @param {String[]} [oauthOptions.scopes] OAuth 2.0 scopes to request (openid must be specified)
	 * @param {String} [oauthOptions.idp] ID of an external IdP to use for user authentication
	 * @param {String} [oauthOptions.sessionToken] Bootstrap Session Token returned by the Okta Authentication API
	 * @param {String} [oauthOptions.prompt] Determines whether the Okta login will be displayed on failure.
	 *                                       Use 'none' to prevent this behavior
	 *
	 * @param {Object} options
	 * @param {Integer} [options.timeout] Time in ms before the flow is automatically terminated. Defaults to 120000
	 * @param {String} [options.popupTitle] Title dispayed in the popup.
	 *                                      Defaults to 'External Identity Provider User Authentication'
	 */
	async _getToken(options: CustomTokenParams & PopupParams) {
		if (arguments.length > 2) {
			throw new AuthSdkError(
				'As of version 3.0, "getToken" takes only a single set of options'
			);
		}

		options = options || {};

		// window object cannot be serialized, save for later use
		// TODO: move popup related params into a separate options object
		const popupWindow = options.popupWindow;
		options.popupWindow = undefined;

		const tokenParams = (await prepareTokenParams(
			this,
			options
		)) as CustomTokenParams;

		return await this.handleGetToken(tokenParams, options);
	}

	_addPostMessageListener(timeout?: number, state?: string) {
		var timeoutId: NodeJS.Timeout;
		let responseHandler: any;

		const msgReceivedOrTimeout = new Promise((resolve, reject) => {
			responseHandler = (e: MessageEvent<any>) => {
				if (!e.data || e.data.state !== state) {
					// A message not meant for us
					return;
				}

				// Configuration mismatch between saved token and current app instance
				// This may happen if apps with different issuers are running on the same host url
				// If they share the same storage key, they may read and write tokens in the same location.
				// Common when developing against http://localhost
				if (e.origin !== this.getIssuerOrigin()) {
					reject(
						new AuthSdkError(
							'The request does not match client configuration'
						)
					);
				}
				resolve(e.data);
			};

			window.addEventListener('message', responseHandler);

			timeoutId = setTimeout(() => {
				reject(new AuthSdkError('OAuth flow timed out'));
			}, timeout || 120000);
		});

		return msgReceivedOrTimeout.finally(() => {
			clearTimeout(timeoutId);
			window.removeEventListener('message', responseHandler);
		});
	}

	async handleGetToken(
		tokenParams: CustomTokenParams,
		options: CustomTokenParams & PopupParams
	) {
		// Start overriding any options that don't make sense
		var sessionTokenOverrides = {
			prompt: 'none',
			responseMode: 'web_message',
			display: null,
		};

		var idpOverrides = {
			display: 'popup',
		};

		if (options.sessionToken) {
			Object.assign(tokenParams, sessionTokenOverrides);
		} else if (options.idp) {
			Object.assign(tokenParams, idpOverrides);
		}

		// Use the query params to build the authorize url
		var requestUrl;
		var endpoint;
		var urls: CustomUrls;

		// Get authorizeUrl and issuer
		urls = getOAuthUrls(this, tokenParams);
		endpoint = options.codeVerifier ? urls.tokenUrl : urls.authorizeUrl;
		requestUrl = endpoint + buildAuthorizeParams(tokenParams);

		var iframePromise = this._addPostMessageListener(
			options.timeout,
			tokenParams.state
		);
		var iframeEl = loadFrame(requestUrl);

		const res = await iframePromise;

		return iframePromise
			.then((res) => {
				return handleOAuthResponse(
					this,
					tokenParams,
					res as OAuthResponse,
					urls
				);
			})
			.finally(function () {
				if (document.body.contains(iframeEl)) {
					iframeEl.parentElement?.removeChild(iframeEl);
				}
			});
	}

	async getAccessTokenSilently(
		options?: CustomTokenParams,
		tokenKey?: string
	): Promise<Tokens | void> {
		try {
			let { extraParams } = options || {};

			if (this.audience && extraParams?.audience !== null) {
				extraParams = {
					...extraParams,
					audience:
						this.audience && Array.isArray(this.audience)
							? this.audience.join(' ')
							: this.audience,
				};
			}

			const { tokens } = await this._getWithoutPrompt({
				extraParams,
				responseMode: 'web_message',
				...options,
			});

			if (tokens) {
				if (tokenKey) {
					for (const [key, value] of Object.entries<Token>(
						tokens as any
					)) {
						this.tokenManager.add(`${tokenKey}_${key}`, value);
					}
				} else {
					this.tokenManager.setTokens(tokens);
				}

				return tokens;
			}
		} catch (err: unknown) {
			console.error(err);
			// TODO implement login_required handling to silently fail
		}
	}

	async getImpersonationToken(subject: string) {
		const extraParams: TokenParams['extraParams'] = {
			subject,
		};

		return await this.getAccessTokenSilently(
			{ extraParams },
			'impersonation'
		);
	}

	async handleRedirect(
		isLoginRedirect: boolean = true,
		tokens?: Tokens,
		originalUri?: string
	): Promise<boolean | void> {
		let state = this.options.state;

		// Store tokens and update AuthState by the emitted events
		if (tokens) {
			this.tokenManager.setTokens(tokens);
			originalUri =
				originalUri || this.getOriginalUri(this.options.state);
		} else if (isLoginRedirect) {
			try {
				console.log('here');
				// For redirect flow, get state from the URL and use it to retrieve the originalUri
				const oAuthResponse = await parseFromUrl(this);
				console.log('============ oAuthResponse ==============');
				console.log(oAuthResponse);
				state = oAuthResponse.state;
				originalUri = originalUri || this.getOriginalUri(state);

				if (oAuthResponse?.tokens) {
					this.tokenManager.setTokens(oAuthResponse.tokens);
				}
			} catch (e) {
				// auth state should be updated
				await this.authStateManager.updateAuthState();
				throw e;
			}
		} else {
			return false; // nothing to do
		}

		// ensure auth state has been updated
		await this.authStateManager.updateAuthState();

		// clear originalUri from storage
		this.removeOriginalUri(state);

		// Redirect to originalUri
		const { restoreOriginalUri } = this.options;
		if (restoreOriginalUri) {
			await restoreOriginalUri(this, originalUri);
		} else if (originalUri) {
			window.location.replace(originalUri);
		}
	}
}
