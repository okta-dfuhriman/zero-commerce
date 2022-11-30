import { Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import { AppBar, PageSpinner, ProtectedRoute } from 'components';
import { useAppState } from 'hooks';

import { theme } from 'styles/theme';
import './styles/App.css';

const App = () => {
	const { isLoading } = useAppState();
	const { isAuthenticated, isLoading: isLoadingAuth } = useAuth0();

	const _isLoading = (!isLoading?.login || !isLoadingAuth) && isLoading?.all;

	return (
		<>
			<CssBaseline />
			<ThemeProvider {...{ theme }}>
				{_isLoading && <PageSpinner loading={_isLoading} />}
				<AppBar />
			</ThemeProvider>
		</>
	);
};

export default App;
