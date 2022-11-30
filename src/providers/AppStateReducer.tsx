import React from 'react';

export const initialAppState: AppState.InitialState = {
	isLoading: true,
};

const isProd = import.meta.env?.PROD;

export const AppStateReducer: React.Reducer<
	AppState.State,
	AppState.Reducer.Action
> = (
	state: AppState.State,
	{ type, payload = {}, error }: AppState.Reducer.Action
) => {
	let newState: AppState.State | {} = {};

	const createState = ({
		newState = {},
		state,
		payload = {},
		error,
	}: AppState.CreateProps) => {
		const endState: AppState.State = {
			...state,
			...newState,
			...payload,
			error,
		};

		if (!isProd) {
			console.group('=== NEW STATE ===');
			console.log(`=== ${type} ===`);
			console.log(JSON.stringify(endState, null, 2));
			console.groupEnd();
		}

		return endState;
	};

	const _default = () => createState({ state, newState, payload });

	switch (type) {
		case 'LOGIN_STARTED':
		case 'PERMISSIONS_FETCHED':
			return _default();
		case 'ERROR':
			newState = {
				isLoading: false,
			};

			return createState({ newState, state, payload, error });
		case 'ERROR_RESET':
			if (state?.error) {
				delete state.error;
			}

			newState = {
				isLoading: false,
			};

			return _default();
		default:
			throw new Error(`Type [${type}] not implemented!`);
	}
};
