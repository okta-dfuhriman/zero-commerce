import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AppStateProvider, AuthProvider, QueryProvider } from 'providers';
import App from './App';
import './styles/index.css';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<QueryProvider>
					<AppStateProvider>
						<App />
					</AppStateProvider>
				</QueryProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
