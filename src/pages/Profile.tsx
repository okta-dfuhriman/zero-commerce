import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

import { useGetUserQuery } from 'hooks';
import { Layout } from 'components';

export const Profile = () => {
	const { data: user, isLoading } = useGetUserQuery();

	return (
		<Layout>
			<Card
				sx={{
					backgroundColor: '#272822',
					minWidth: { sm: '756px', lg: '1056px' },
					minHeight: '550px',
				}}
			>
				<CardContent>
					{!isLoading && user && (
						<JSONPretty data={JSON.stringify(user)} />
					)}
					{isLoading && (
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								mt: 16,
							}}
						>
							<CircularProgress size={96} />
						</Box>
					)}
				</CardContent>
			</Card>
		</Layout>
	);
};
