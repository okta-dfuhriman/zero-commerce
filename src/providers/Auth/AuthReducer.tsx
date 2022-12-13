export const AuthReducer: React.Reducer<Auth.State, Auth.Reducer.Action> = (
	state,
	{ type: actionType, error, ...newState }
) => {
	const responder = (data?: Partial<Auth.State> | true) => {
		console.log(`===== ${actionType} =====`);
		// console.group('=== STATE ===');
		// console.log(state);
		// console.groupEnd();

		// return state as-is
		if (data === true) {
			return state;
		}

		const endState: Auth.State = {
			...state,
			...newState,
			...data,
		};

		// console.group(`=== ${actionType} => NEW STATE ===`);
		// console.log(endState);
		// console.groupEnd();

		return { ...endState };
	};

	switch (actionType) {
		case 'AUTH_STATE_UPDATED':
			return responder();
		case 'GET_IMPERSONATION_TOKENS_COMPLETE':
			return responder({ isLoading: false });
		case 'GET_TOKENS_WITHOUT_PROMPT_STARTED':
			return responder({ isLoading: true });
		case 'HANDLING_LOGIN_REDIRECT':
			return responder({ isLoading: true });
		case 'IMPERSONATION_TOKENS_CLEARED':
			return responder({
				impersonation_accessToken: undefined,
			});
		case 'INITIALIZED':
			return responder({
				isInitialized: true,
				isLoading: false,
			});
		case 'LOGIN_COMPLETE':
		case 'LOGOUT_COMPLETE':
			return responder({ isLoading: false });
		case 'LOGIN_STARTED':
			return responder({
				isLoading: true,
			});
		case 'ERROR':
			console.log('BIG FAT ERROR!');
			console.error(error);
			return responder();
		default:
			throw new Error(`Unsupported operation: ${actionType}`);
	}
};
