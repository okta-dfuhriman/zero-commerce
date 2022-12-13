const stub = () => {
	throw new Error('You forgot to wrap your app with an AuthProvider!');
};

export const initialAuthState: Auth.InitialState = {
	isAuthenticated: false,
	isLoading: false,
	isLoadingLogout: false,
	isInitialized: false,
	clearImpersonationTokens: stub,
	getImpersonationToken: stub,
	getPermissions: stub,
	login: stub,
	logout: stub,
};
