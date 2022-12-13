import { forwardRef, useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/PowerSettingsNew';
import { useAuth } from 'hooks';

import type { MenuItemProps } from '@mui/material/MenuItem';

/**
 * Logout button component, to be used in the AppBar
 *
 */
export const LogoutMenuItem: React.FunctionComponent<
	LogoutMenuItemProps & MenuItemProps<'li'>
> = forwardRef((props, ref) => {
	const { className, icon, ...rest } = props;
	const { logout } = useAuth();

	return (
		<MenuItem onClick={() => logout()} ref={ref} {...rest}>
			<ListItemIcon>{icon ? icon : <LogoutIcon />}</ListItemIcon>
			<ListItemText>Logout</ListItemText>
		</MenuItem>
	);
});

export interface LogoutMenuItemProps {
	className?: string;
	icon?: React.ReactElement;
}
