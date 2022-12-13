import React, { useEffect, useState } from 'react';
import {
	AppBar as MuiAppBar,
	Box,
	Button,
	CircularProgress,
	Container,
	Divider,
	Toolbar,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useIsMutating } from '@tanstack/react-query';

import type { AppBarProps as MuiAppBarProps } from '@mui/material';

import { MenuDrawer } from './MenuDrawer';
import { Logo } from './Logo';
import { LoginButton } from 'components/Buttons';
import { UserMenu } from './UserMenu';
import { ElevationScroll } from './ElevationScroll';
import { useAuth, useGetUserQuery } from 'hooks';

export interface AppBarProps extends Omit<MuiAppBarProps, 'title'> {
	container?: React.ElementType<any>;
	open?: boolean;
	title?: string | JSX.Element;
	userMenu?: JSX.Element | boolean;
}

export interface Page {
	name: string;
	path: string;
	icon?: React.ReactNode;
}

// const pages: Pages[] = [
// 	{
// 		name: 'Tenants',
// 		path: '/tenants',
// 	},
// ];

export const AppBar = (props: AppBarProps) => {
	const location = useLocation();
	const { children, className, color, open, title, userMenu, ...rest } =
		props;
	const [pages, setPages] = useState<Page[] | []>([]);

	const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();
	const { data: user, isLoading: isLoadingGetUser } = useGetUserQuery();

	const isMutating = useIsMutating(['auth']) > 0;

	const isLoading = isLoadingAuth || isMutating;

	useEffect(() => {
		if (
			isAuthenticated &&
			!isLoadingGetUser &&
			user &&
			(user['rocks.atko.fabriship/roles'] as string[])?.includes('admin')
		) {
			setPages((_pages) => {
				if (_pages.findIndex(({ name }) => name !== 'Customers') > 0) {
					return [..._pages];
				}
				return [{ name: 'Customers', path: '/customers' }];
			});
		}
	}, [isAuthenticated, isLoadingGetUser, user]);

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
								alignItems: 'stretch',
							}}
						>
							<Logo>Zero Commerce</Logo>
							<Box
								sx={{
									display: { xs: 'none', sm: 'flex' },
									justifyContent: 'flex-start',
									alignItems: 'end',
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
											disabled={
												location?.pathname === path
											}
											sx={{
												color: 'inherit',
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
