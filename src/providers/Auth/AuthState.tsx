const stub = () => {
	throw new Error('You forgot to wrap your app with an AuthProvider!');
};

export const initialAuthState: Auth.InitialState = {
	isAuthenticated: false,
	isLoading: false,
	isLoadingLogout: false,
	isInitialized: false,
	getPermissions: stub,
	login: stub,
	logout: stub,
};
