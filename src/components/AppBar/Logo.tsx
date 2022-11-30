import { Box } from '@mui/material';
import type { SxProps, TypographyProps } from '@mui/material';

export const Logo = ({ children, sx: _sx, ...props }: TypographyProps) => {
	const sx: Partial<SxProps> = {
		mr: 2,
		display: 'flex',
		maxHeight: '48px',
		alignItems: 'stretch',
		justifyContent: 'flex-start',
		..._sx,
	};
	return (
		<Box {...{ sx }}>
			<img
				src='/logos/logo_transparent.png'
				style={{ maxHeight: 'inherit' }}
			/>
		</Box>
	);
};
