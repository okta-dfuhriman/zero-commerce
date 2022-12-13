import { styled } from '@mui/material/styles';
import { LoadingButton } from '../LoadingButton';
import { useAuth } from 'hooks';

import type { LoadingButtonProps } from '@mui/lab/LoadingButton';

export interface LoginButtonProps extends LoadingButtonProps {
	flow?: 'login' | 'signup';
}

export const LoginButton = ({
	flow = 'login',
	children,
	...props
}: LoginButtonProps) => {
	const { login, isLoading } = useAuth();

	const StyledLoadingButton = styled(LoadingButton)({
		'.MuiLoadingButton-loadingIndicator': {
			color: '#ffffff',
		},
	});

	const defaultLabel = flow === 'signup' ? 'Enroll' : 'Login';
	const label = children ? children : defaultLabel;

	return (
		<StyledLoadingButton
			onClick={() => login()}
			color='secondary'
			variant='contained'
			loading={isLoading}
			{...props}
		>
			{label}
		</StyledLoadingButton>
	);
};
