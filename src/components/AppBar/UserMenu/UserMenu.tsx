import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Tooltip,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { AccountCircle as PersonIcon } from '@mui/icons-material';

import { LogoutMenuItem } from './LogoutMenuItem';

interface MenuItem {
	key: string;
	icon?: React.ReactNode;
	path: string;
	name: string;
}

export interface UserMenuProps {
	menuItems?: MenuItem[];
}

const _menuItems: MenuItem[] = [
	{
		key: 'me-page',
		name: 'Profile',
		icon: <PersonIcon />,
		path: '/me',
	},
];

export const UserMenu = ({ menuItems = [] }: UserMenuProps) => {
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { user } = useAuth0() || {};

	menuItems = [..._menuItems, ...menuItems];

	const { picture, name } = user || {};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
		setAnchorElUser(event.currentTarget);

	const handleCloseUserMenu = (event: React.MouseEvent<HTMLElement>) =>
		setAnchorElUser(null);

	return (
		<Box sx={{ flexGrow: 0 }}>
			<Tooltip title='Open Settings'>
				<Button
					onClick={handleOpenUserMenu}
					sx={{ p: 0 }}
					variant='text'
					color='inherit'
					startIcon={<Avatar alt='user avatar' src={picture} />}
				>
					{name}
				</Button>
			</Tooltip>
			<Menu
				id='menu-appbar'
				anchorEl={anchorElUser}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
				onClick={handleCloseUserMenu}
				PaperProps={{
					elevation: 0,
					sx: {
						minWidth: '12em',
						overflow: 'visible',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 1.5,
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgColor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
			>
				{menuItems.map(({ key, icon, name, path: to }) => (
					<MenuItem {...{ key, to }} component={Link}>
						<ListItemIcon>{icon}</ListItemIcon>
						<ListItemText>{name}</ListItemText>
					</MenuItem>
				))}
				<Divider />
				<LogoutMenuItem />
			</Menu>
		</Box>
	);
};
