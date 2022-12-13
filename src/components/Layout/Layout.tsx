import { Container, Stack } from '@mui/material';
import { PageSpinner } from 'components';

import type { ContainerProps } from '@mui/system';

interface LayoutProps extends ContainerProps {
	loading?: boolean;
}

export const Layout = ({
	loading = false,
	sx: _sx,
	children,
	...props
}: LayoutProps) => (
	<>
		<Container
			sx={{
				maxWidth: '100vw',
				display: 'flex',
				justifyContent: 'center',
				pt: 6,
				minHeight: '100vh',
				..._sx,
			}}
			{...props}
		>
			<Stack>
				{loading && (
					<PageSpinner
						fullScreen
						LoaderProps={{ color: 'secondary' }}
					/>
				)}
				{children}
			</Stack>
		</Container>
	</>
);
