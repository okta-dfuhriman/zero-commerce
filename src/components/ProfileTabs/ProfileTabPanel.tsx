import { Box } from '@mui/material';

interface ProfileTabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
	[key: string]: any;
}

export const ProfileTabPanel = ({
	children,
	value,
	index,
	...props
}: ProfileTabPanelProps) => (
	<Box
		role='tabpanel'
		hidden={value !== index}
		id={`profile-tab-${index}`}
		{...props}
	>
		{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</Box>
);
