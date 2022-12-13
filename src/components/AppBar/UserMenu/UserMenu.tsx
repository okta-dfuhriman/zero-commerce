import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';
import {
	Avatar,
	Box,
	Divider,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from '@mui/material';
import {
	AccountCircle as PersonIcon,
	People as CustomersIcon,
} from '@mui/icons-material';

import { LoadingButton } from 'components/Buttons';
import { useGetUserQuery } from 'hooks';
import { LogoutMenuItem } from './LogoutMenuItem';

export const UserMenu = () => {
	const location = useLocation();
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const { data: user } = useGetUserQuery();
	const isLoadingUser = useIsFetching(['user']) > 0;

	const { picture, name } = (user as User.Claims) || {};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
		setAnchorElUser(event.currentTarget);

	const handleCloseUserMenu = (_: React.MouseEvent<HTMLElement>) =>
		setAnchorElUser(null);

	return (
		<Box sx={{ flexGrow: 0, minWidth: '192px' }}>
			<LoadingButton
				onClick={handleOpenUserMenu}
				variant='text'
				size='large'
				color='inherit'
				loading={isLoadingUser}
				startIcon={
					!isLoadingUser && <Avatar alt='user avatar' src={picture} />
				}
			>
				{name}
			</LoadingButton>
			<Menu
				id='menu-appbar'
				anchorEl={anchorElUser}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
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
				{!location.pathname.includes('profile') && (
					<MenuItem key='profile-page' to='/profile' component={Link}>
						<ListItemIcon>
							<PersonIcon />
						</ListItemIcon>
						<ListItemText>Profile</ListItemText>
					</MenuItem>
				)}
				{!location.pathname.includes('customers') && (
					<MenuItem
						key='customers-page'
						to='/customers'
						component={Link}
					>
						<ListItemIcon>
							<CustomersIcon />
						</ListItemIcon>
						<ListItemText>Customers</ListItemText>
					</MenuItem>
				)}
				<Divider />
				<LogoutMenuItem />
			</Menu>
		</Box>
	);
};
