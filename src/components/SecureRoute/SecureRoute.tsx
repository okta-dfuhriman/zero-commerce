import { useEffect, useRef } from 'react';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { toRelativeUrl } from '@okta/okta-auth-js';

import { PageSpinner } from 'components';
import { useAuth } from 'hooks';

import type { ContainerProps } from '@mui/material';

interface SecureRouteProps {
	children?: React.ReactElement;
	ContainerProps?: ContainerProps;
	onAuthRequired?: Auth.OnAuthRequired;
}

export const SecureRoute = ({
	children,
	ContainerProps,
	onAuthRequired,
}: SecureRouteProps) => {
	const { authClient, isAuthenticated, isInitialized, isLoading, login } =
		useAuth();

	const pendingLogin = useRef(false);

	useEffect(() => {
		const handleLogin = async () => {
			if (pendingLogin.current) {
				return;
			}

			pendingLogin.current = true;

			if (!isAuthenticated) {
				const originalUri = toRelativeUrl(
					window.location.href,
					window.location.origin
				);

				authClient.setOriginalUri(originalUri);

				if (onAuthRequired) {
					await onAuthRequired(authClient);
				} else {
					login();
				}
			}
		};

		if (isAuthenticated) {
			pendingLogin.current = false;
			return;
		}

		if (isInitialized && !isAuthenticated && !isLoading) {
			handleLogin();
		}
	}, [authClient, isAuthenticated, isInitialized, isLoading]);

	return (
		<Container maxWidth='xl' {...ContainerProps}>
			{isLoading && <PageSpinner loading={isLoading} />}
			{children}
			{!children && <Outlet />}
		</Container>
	);
};
