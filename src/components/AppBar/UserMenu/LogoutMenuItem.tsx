import { forwardRef, useCallback } from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/PowerSettingsNew';
import { useLogoutMutation } from 'hooks';

import type { MenuItemProps } from '@mui/material/MenuItem';

/**
 * Logout button component, to be used in the AppBar
 *
 */
export const LogoutMenuItem: React.FunctionComponent<
	LogoutMenuItemProps & MenuItemProps<'li'>
> = forwardRef((props, ref) => {
	const { className, icon, ...rest } = props;
	const { mutate: logout } = useLogoutMutation();

	const handleClick = useCallback(() => {
		logout({ returnTo: window.location.origin });
	}, []);

	return (
		<MenuItem onClick={handleClick} ref={ref} {...rest}>
			<ListItemIcon>{icon ? icon : <LogoutIcon />}</ListItemIcon>
			<ListItemText>Logout</ListItemText>
		</MenuItem>
	);
});

export interface LogoutMenuItemProps {
	className?: string;
	icon?: React.ReactElement;
}
