import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import {
	AuthClient,
	AuthProvider,
	CartProvider,
	QueryProvider,
} from 'providers';
import App from './App';
import './styles/index.css';

const container = document.getElementById('app');
const root = createRoot(container!);

const authClient = new AuthClient();

root.render(
	<StrictMode>
		<BrowserRouter>
			<QueryProvider>
				<AuthProvider {...{ authClient }}>
					<CartProvider>
						<App />
					</CartProvider>
				</AuthProvider>
			</QueryProvider>
		</BrowserRouter>
	</StrictMode>
);
