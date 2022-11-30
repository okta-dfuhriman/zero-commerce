import {
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

export interface MenuDrawerItemProps {
	navItems?: {
		name: string;
		path: string;
	}[];
	onClose?: React.MouseEventHandler<HTMLDivElement>;
}

export const MenuDrawerItems = ({ navItems = [] }: MenuDrawerItemProps) => {
	return (
		<Box sx={{ textAlign: 'center' }}>
			<List>
				{navItems.map(({ name: pageName, path }) => (
					<ListItem key={pageName} disablePadding>
						<ListItemButton
							component={Link}
							to={path}
							sx={{ textAlign: 'center' }}
						>
							<ListItemText primary={pageName} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
};
