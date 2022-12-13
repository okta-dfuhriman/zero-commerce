import { Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { AppBar, PageSpinner, SecureRoute } from 'components';
import { useAuth } from 'hooks';
import { Customers, Profile } from 'pages';

import { theme } from 'styles/theme';
import './styles/App.css';

const App = () => {
	const { isAuthenticated, isLoading } = useAuth();

	return (
		<>
			<CssBaseline />
			<ThemeProvider {...{ theme }}>
				<PageSpinner loading={isLoading} />
				<AppBar />
				<Routes>
					<Route path='/customers' element={<Customers />} />
					<Route path='profile' element={<Profile />} />
					<Route path='/' element={<Customers />} />
				</Routes>
			</ThemeProvider>
		</>
	);
};

export default App;
