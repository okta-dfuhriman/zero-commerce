import { Backdrop, CircularProgress, useTheme } from '@mui/material';
import { useLockBodyScroll } from 'hooks';

import { OktaSpinner } from './OktaSpinner';

import type {
	BackdropProps,
	CircularProgressProps,
	LinearProgressProps,
} from '@mui/material';

interface PageSpinnerProps {
	allowScroll?: boolean;
	closable?: boolean;
	variant?: 'okta' | 'mui';
	fullScreen?: boolean;
	loading?: boolean;
	BackdropProps?: BackdropProps;
	LoaderProps?: CircularProgressProps | LinearProgressProps;
}

export const PageSpinner = ({
	allowScroll = false,
	closable = false,
	fullScreen = false,
	variant = 'okta',
	loading = false,
	LoaderProps,
	BackdropProps,
}: PageSpinnerProps) => {
	const theme = useTheme();

	const isDark = theme.palette.mode === 'dark';

	if (!allowScroll) {
		useLockBodyScroll();
	}

	const { open = loading, onClick, ...backDropProps } = BackdropProps || {};

	return (
		<div>
			<Backdrop
				{...{
					open,
					sx: {
						backgroundColor: !isDark
							? 'rgba(255, 255, 255, 0.75)'
							: undefined,
						zIndex: fullScreen
							? theme.zIndex.drawer + 1
							: theme.zIndex.appBar - 1,
					},
					...backDropProps,
				}}
			>
				{variant === 'mui' && (
					<CircularProgress
						{...{
							color: 'primary',
							size: 128,
							...(LoaderProps as CircularProgressProps),
						}}
					/>
				)}
				{variant === 'okta' && <OktaSpinner />}
			</Backdrop>
		</div>
	);
};
