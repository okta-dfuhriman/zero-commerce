import { Card, CardContent } from '@mui/material';
import { PageLayout, ProfileTabs } from 'components';

export const MePage = () => (
	<PageLayout>
		<Card>
			<CardContent>
				<ProfileTabs />
			</CardContent>
		</Card>
	</PageLayout>
);
