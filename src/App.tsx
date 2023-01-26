import { Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import { PageLayout, PageSpinner, ProtectedRoute } from 'components';
import { HomePage, MePage } from 'pages';
import { useAppState } from 'hooks';

import { theme } from 'styles/theme';
import './styles/App.css';

const App = () => {
	const { isLoading } = useAppState();
	const { isLoading: isLoadingAuth } = useAuth0();

	const _isLoading = (!isLoading?.login || !isLoadingAuth) && isLoading?.all;

	return (
		<>
			<CssBaseline />
			<ThemeProvider {...{ theme }}>
				{_isLoading && <PageSpinner loading={_isLoading} />}
				<Routes>
					<Route
						path='me/*'
						element={<ProtectedRoute component={MePage} />}
					/>
					<Route path='*' element={<HomePage />} />
				</Routes>
			</ThemeProvider>
		</>
	);
};

export default App;
