import React from 'react';
import { AppStateContext } from 'providers';

export const useAppState = () => {
	const context = React.useContext(AppStateContext);

	if (context === undefined) {
		throw new Error('useAppState must be used within an AppStateProvider.');
	}
	return context as AppState.State;
};
