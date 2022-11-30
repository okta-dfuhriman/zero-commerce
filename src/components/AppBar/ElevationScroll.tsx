import { cloneElement } from 'react';
import { useScrollTrigger } from '@mui/material';

export const ElevationScroll = ({
	children,
}: {
	children: React.ReactElement;
}) => {
	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window,
	});

	return cloneElement(children, { elevation: trigger ? 4 : 0 });
};
