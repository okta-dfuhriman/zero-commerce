import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

import { Layout } from 'components';
import { Customers } from 'pages';
import { useAuth, useGetUserQuery } from 'hooks';

export const Home = () => {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();
	const { data: user, isLoading: isLoadingGetUser } = useGetUserQuery();

	useEffect(() => {
		if (isAuthenticated && user) {
			const path = (
				user['rocks.atko.fabriship/roles'] as string[]
			)?.includes('admin')
				? '/customers'
				: '/profile';

			navigate(path, { replace: true });
		}
	}, [isAuthenticated, user]);

	return (
		<Layout loading={isLoading || isLoadingGetUser}>
			{!isAuthenticated && (
				<Typography variant='h6'>
					<em>Please login to continue</em>
				</Typography>
			)}
		</Layout>
	);
};
