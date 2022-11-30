import { styled } from '@mui/material/styles';
import { LoadingButton } from '../LoadingButton';
import { useAppState } from 'hooks';

import type { LoadingButtonProps } from '@mui/lab/LoadingButton';

export interface LoginButtonProps extends LoadingButtonProps {
	flow?: 'login' | 'signup';
}

export const LoginButton = ({
	flow = 'login',
	children,
	...props
}: LoginButtonProps) => {
	const { login, isLoading } = useAppState();

	const handleClick = () => {
		if (!isLoading?.login) {
			const options = {
				screen_hint: flow,
			};

			if (flow === 'signup') {
				options['screen_hint'] = flow;
			}

			login(options);
		}
	};

	const StyledLoadingButton = styled(LoadingButton)({
		'.MuiLoadingButton-loadingIndicator': {
			color: '#ffffff',
		},
	});

	const defaultLabel = flow === 'signup' ? 'Enroll' : 'Login';
	const label = children ? children : defaultLabel;

	return (
		<StyledLoadingButton
			onClick={handleClick}
			color='secondary'
			variant='contained'
			loading={isLoading?.login}
			{...props}
		>
			{label}
		</StyledLoadingButton>
	);
};
