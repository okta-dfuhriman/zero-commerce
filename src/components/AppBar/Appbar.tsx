import React from 'react';
import {
	AppBar as MuiAppBar,
	Box,
	Button,
	CircularProgress,
	Container,
	Divider,
	Toolbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useIsMutating } from '@tanstack/react-query';

import type { AppBarProps as MuiAppBarProps } from '@mui/material';

import { MenuDrawer } from './MenuDrawer';
import { Logo } from './Logo';
import { LoginButton } from 'components/Buttons';
import { UserMenu } from './UserMenu';
import { ElevationScroll } from './ElevationScroll';

export interface AppBarProps extends Omit<MuiAppBarProps, 'title'> {
	container?: React.ElementType<any>;
	open?: boolean;
	title?: string | JSX.Element;
	userMenu?: JSX.Element | boolean;
}

export interface Pages {
	name: string;
	path: string;
	icon?: React.ReactNode;
}

const pages: Pages[] = [
	// {
	// 	name: 'Tenants',
	// 	path: '/tenants',
	// },
];

export const AppBar = (props: AppBarProps) => {
	const { children, className, color, open, title, userMenu, ...rest } =
		props;

	const { isAuthenticated, isLoading: isLoadingAuth } = useAuth0();

	const isMutating = useIsMutating(['auth']) > 0;

	const isLoading = isLoadingAuth || isMutating;

	return (
		<ElevationScroll>
			<MuiAppBar
				{...{
					color,
					...rest,
				}}
			>
				<Container maxWidth='xl'>
					<Toolbar
						sx={{
							justifyContent: 'space-between',
							minHeight: '64px',
						}}
					>
						{pages.length > 0 && <MenuDrawer navItems={pages} />}
						<Box
							sx={{
								display: 'flex',
								flex: { xs: 10, sm: 11 },
								justifyContent: {
									xs: 'center',
									sm: 'flex-start',
								},
								alignItems: 'center',
							}}
						>
							<Logo>Zero Commerce</Logo>
							{pages?.length > 0 && (
								<Divider
									orientation='vertical'
									variant='middle'
									flexItem
									light
									sx={{ borderColor: 'inherit' }}
								/>
							)}
							<Box
								sx={{
									display: { xs: 'none', sm: 'flex' },
									justifyContent: 'flex-start',
									flex: 11,
									mx: 2,
								}}
							>
								<Box>
									{pages.map(({ name: pageName, path }) => (
										<Button
											key={pageName}
											component={Link}
											to={path}
											sx={{
												color: 'white',
												display: 'block',
											}}
										>
											{pageName}
										</Button>
									))}
								</Box>
							</Box>
						</Box>
						{isLoading && (
							<CircularProgress
								color='inherit'
								size={40}
								sx={{ display: 'flex' }}
							/>
						)}
						{!isLoading && !isAuthenticated && <LoginButton />}
						{!isLoading && isAuthenticated && <UserMenu />}
					</Toolbar>
				</Container>
			</MuiAppBar>
		</ElevationScroll>
	);
};
