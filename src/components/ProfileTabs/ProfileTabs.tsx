import { useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { Box, Tabs } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import { CodeBlock } from 'components';
import { ProfileTab } from './ProfileTab';
import { ProfileTabPanel } from './ProfileTabPanel';

import type { IdToken } from '@auth0/auth0-react';

export const ProfileTabs = () => {
	const navigate = useNavigate();
	const match = useMatch(`me/id_token`);

	const value = match ? 1 : 0;

	const [idTokenClaims, setIdTokenClaims] = useState<IdToken | undefined>();

	const { isAuthenticated, getIdTokenClaims, user } = useAuth0();

	useEffect(() => {
		if (isAuthenticated) {
			getIdTokenClaims().then((claims) => {
				const { __raw, ...rest } = claims || {};

				setIdTokenClaims(rest as IdToken);
			});
		}
	}, [isAuthenticated, getIdTokenClaims]);

	const handleChange = (_: React.SyntheticEvent, newValue: number) =>
		navigate(newValue === 1 ? '/me/id_token' : '/me');

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs onChange={handleChange} {...{ value }}>
					<ProfileTab key='profile-tab' label='Profile' />
					<ProfileTab key='id-token-claims' label='ID Token' />
				</Tabs>
			</Box>
			<ProfileTabPanel {...{ index: 0, value }}>
				{user && <CodeBlock data={JSON.stringify(user)} />}
			</ProfileTabPanel>
			<ProfileTabPanel {...{ index: 1, value }}>
				{idTokenClaims && <CodeBlock data={idTokenClaims} />}
			</ProfileTabPanel>
		</Box>
	);
};
