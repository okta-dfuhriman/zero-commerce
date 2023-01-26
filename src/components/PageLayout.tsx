import { Container, Box } from '@mui/material';

import { AppBar } from './AppBar';

import type { ContainerProps, BoxProps } from '@mui/material';

export interface LayoutProps extends ContainerProps {
	BoxProps?: BoxProps;
	hideAppBar?: boolean;
}

export const PageLayout = (_props: LayoutProps) => {
	const {
		hideAppBar = false,
		BoxProps: _BoxProps,
		children,
		...ContainerProps
	} = _props;
	const { sx: BoxSx, ...BoxProps } = _BoxProps || {};

	return (
		<>
			{!hideAppBar && <AppBar />}
			<Container
				sx={{
					minHeight: '100vh',
					placeContent: 'center',
					display: 'flex',
				}}
				{...ContainerProps}
			>
				<Box
					{...{
						sx: {
							my: 8,
							width: '100%',
							...BoxSx,
						},
						...BoxProps,
					}}
				>
					{children}
				</Box>
			</Container>
		</>
	);
};
