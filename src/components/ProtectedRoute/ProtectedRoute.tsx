import { Container } from '@mui/material';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';

import type { ContainerProps } from '@mui/material';

interface ProtectedRouteProps {
	component: React.ComponentType<object>;
	ContainerProps?: ContainerProps;
	[key: string]: any;
}

const ProtectedRoute = ({
	component,
	ContainerProps,
	...props
}: ProtectedRouteProps) => {
	const Component = withAuthenticationRequired(component, props);

	return (
		<Container maxWidth='xl' {...ContainerProps}>
			<Component />
		</Container>
	);
};

export default ProtectedRoute;
