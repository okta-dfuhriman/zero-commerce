import { Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { AppBar, PageSpinner, SecureRoute } from 'components';
import { useAuth, useGetUserQuery } from 'hooks';
import { Customers, Home, Profile } from 'pages';

import { theme } from 'styles/theme';
import './styles/App.css';

const App = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const { data: user, isLoading: isLoadingGetUser } = useGetUserQuery();

	return (
		<>
			<CssBaseline />
			<ThemeProvider {...{ theme }}>
				<PageSpinner loading={isLoading} />
				<AppBar />
				<Routes>
					{isAuthenticated &&
						user &&
						(
							user['rocks.atko.fabriship/roles'] as string[]
						)?.includes('admin') && (
							<Route path='/customers' element={<Customers />} />
						)}
					<Route path='profile' element={<Profile />} />
					<Route path='/' element={<Home />} />
				</Routes>
			</ThemeProvider>
		</>
	);
};

export default App;
