import React, { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Dialog,
	DialogContent,
	Divider,
	IconButton,
	Stack,
	Toolbar,
	Typography,
} from '@mui/material';
import JSONPretty from 'react-json-pretty';
import { Close as CloseIcon } from '@mui/icons-material';
import 'react-json-pretty/themes/monikai.css';

import { LoadingButton } from 'components';
import { useAuth } from 'hooks';

import type { UserData } from 'auth0';
import type { DialogProps } from '@mui/material';

interface CustomerProps extends DialogProps {
	customer?: UserData;
}

export const Customer = ({ customer, open, onClose }: CustomerProps) => {
	const { name, user_id } = customer || {};
	const {
		getImpersonationToken,
		impersonation_accessToken: impersonationToken,
	} = useAuth();

	return (
		<Dialog
			fullWidth
			{...{
				open,
				onClose,
				maxWidth: 'lg',
				scroll: 'paper',
			}}
		>
			<Toolbar sx={{ justifyContent: 'space-between' }}>
				<Box sx={{ flex: 10 }}>
					<Typography variant='h5'>{name}</Typography>
				</Box>
				<Box>
					<IconButton
						color='inherit'
						onClick={onClose as React.MouseEventHandler}
					>
						<CloseIcon />
					</IconButton>
				</Box>
			</Toolbar>
			<DialogContent>
				<Stack gap={2}>
					<Box
						sx={{
							backgroundColor: '#272822',
							p: 3,
							borderRadius: 2,
						}}
					>
						<JSONPretty data={JSON.stringify(customer)} />
					</Box>
					<Box>
						<Toolbar sx={{ justifyContent: 'space-between' }}>
							<Typography variant='h6'>
								Impersonation Token
							</Typography>
							{!impersonationToken && (
								<Box>
									<LoadingButton
										size='small'
										variant='contained'
										color='secondary'
										fullWidth={false}
										disabled={!!impersonationToken}
										onClick={() =>
											getImpersonationToken(user_id!)
										}
									>
										Get Token
									</LoadingButton>
								</Box>
							)}
						</Toolbar>
						<Divider />
						{impersonationToken && impersonationToken?.claims && (
							<Box
								sx={{
									backgroundColor: '#272822',
									p: 3,
									borderRadius: 2,
								}}
							>
								<JSONPretty
									data={JSON.stringify(
										impersonationToken.claims
									)}
								/>
							</Box>
						)}
					</Box>
				</Stack>
			</DialogContent>
		</Dialog>
	);
};
