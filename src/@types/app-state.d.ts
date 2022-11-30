import type { RedirectLoginOptions } from '@auth0/auth0-react';
import React from 'react';

declare global {
	namespace AppState {
		interface CreateProps {
			newState: Partial<AppState.State>;
			state: AppState.State;
			payload: AppState.Reducer.ActionPayload;
			error?: any;
		}

		namespace Provider {
			interface Props {
				children?: React.ReactNode;
			}

			type StateInitializer = (state: AppState.State) => AppState.State;
		}

		namespace Reducer {
			interface Action {
				type: ActionType;
				payload?: ActionPayload;
				error?: unknown;
			}

			type ActionPayload = Partial<AppState.State>;

			type ActionType =
				| 'ERROR'
				| 'ERROR_RESET'
				| 'LOGIN_STARTED'
				| 'PERMISSIONS_FETCHED';
		}

		type InitialState = Omit<AppState.State, 'getAccessToken'>;

		interface State {
			isLoading: {
				all?: boolean;
				login?: boolean;
			};
			permissions?: string[];
			error?: any;
			getAccessToken: () => Promise<string>;
			login: (options: RedirectLoginOptions) => void;
			[key: string]: any;
		}
	}
}

export {};
