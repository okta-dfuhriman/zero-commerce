import { Stack } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import { PageLayout } from 'components';

export const HomePage = () => {
	const { isAuthenticated } = useAuth0();

	return (
		<PageLayout>
			<Stack alignItems='center'>
				{isAuthenticated && (
					<>
						You did it! You authenticated!
						<img src='https://media.tenor.com/fHJwPxc3VhgAAAAi/roar-ruar.gif' />
					</>
				)}
				{!isAuthenticated && (
					<>
						Please log in to continue...
						<img
							src='https://media.giphy.com/media/5SAPlGAS1YnLN9jHua/giphy.gif'
							width='100%'
						/>
					</>
				)}
			</Stack>
		</PageLayout>
	);
};
