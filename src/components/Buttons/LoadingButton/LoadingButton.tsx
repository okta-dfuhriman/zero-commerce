import { LoadingButton as MuiLoadingButton } from '@mui/lab';
import { CircularProgress } from '@mui/material';

import type { LoadingButtonProps } from '@mui/lab/LoadingButton';

export const LoadingButton = (props: LoadingButtonProps) => {
	return (
		<MuiLoadingButton
			loadingIndicator={<CircularProgress color='inherit' size={24} />}
			{...props}
		/>
	);
};
