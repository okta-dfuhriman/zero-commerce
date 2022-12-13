import { Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { AppBar, PageSpinner, SecureRoute } from 'components';
import { useAuth } from 'hooks';
import { Employee } from 'pages';

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
					<Route path='/' element={<Employee />} />
				</Routes>
			</ThemeProvider>
		</>
	);
};

export default App;
