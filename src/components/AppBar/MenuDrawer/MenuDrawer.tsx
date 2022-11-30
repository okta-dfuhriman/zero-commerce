import { useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

import { MenuDrawerItems } from './MenuDrawerItems';

import type { DrawerProps } from '@mui/material';

const drawerWidth = 240;

export interface MenuDrawerProps extends DrawerProps {
	navItems?: any;
}

export const MenuDrawer = ({
	open = false,
	navItems,
	...props
}: MenuDrawerProps) => {
	const [isOpen, setIsOpen] = useState(open);

	const toggleDrawer = () => setIsOpen(!isOpen);

	const { onClose = toggleDrawer } = props;

	return (
		<>
			<IconButton
				edge='start'
				onClick={toggleDrawer}
				color='inherit'
				sx={{ mr: 2, display: { sm: 'none' } }}
			>
				<MenuIcon />
			</IconButton>
			<Box component='nav'>
				<Drawer
					variant='temporary'
					open={isOpen}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
					{...{ onClose }}
				>
					<MenuDrawerItems {...{ navItems }} />
				</Drawer>
			</Box>
		</>
	);
};
