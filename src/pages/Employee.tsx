import { useState } from 'react';
import {
	Button,
	Container,
	Dialog,
	DialogContent,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Toolbar,
	Tooltip,
	useMediaQuery,
	useTheme,
} from '@mui/material';
// import { ToastContainer, toast } from 'react-toastify';
import JSONPretty from 'react-json-pretty';
import {
	Close as CloseIcon,
	Visibility as VisibilityIcon,
} from '@mui/icons-material';
import 'react-json-pretty/themes/monikai.css';

import { Customer, LoadingButton, TableSpinner } from 'components';
import {
	useAuth,
	useGetImpersonationTokenMutation,
	useGetUsersQuery,
	useSomethingApi,
} from 'hooks';

import type { GridRowsProp } from '@mui/x-data-grid';
import type { UserData } from 'auth0';

export const Employee = () => {
	const { authClient, isAuthenticated, isLoading, clearImpersonationTokens } =
		useAuth();

	const [rows, setRowsData] = useState<GridRowsProp>([
		{ id: '001', name: 'Dummy User' },
	]);
	const [dialogOpen, toggleDialog] = useState(false);
	const [activeUser, setActiveUser] = useState<UserData | undefined>();

	const handleCloseDialog = () => {
		setActiveUser(undefined);
		toggleDialog(false);
		clearImpersonationTokens();
	};

	const rowFormatter = (users: UserData[]) => setRowsData(users);

	const { isLoading: isLoadingGetUsers } = useGetUsersQuery(
		authClient,
		rowFormatter
	);
	const {
		isLoading: isLoadingGetImpersonation,
		mutate: getImpersonationToken,
		data: impersonationTokens,
	} = useGetImpersonationTokenMutation();

	const {
		mutate: getSomethingAPI,
		data: getSomethingResult,
		isLoading: isLoadingGetSomething,
	} = useSomethingApi(authClient);
	const {
		mutate: doSomethingAPI,
		data: doSomethingResult,
		isLoading: isLoadingDoSomething,
	} = useSomethingApi(authClient, 'POST');

	return (
		<Container
			sx={{
				maxWidth: '100vw',
				display: 'flex',
				justifyContent: 'center',
				pt: 6,
			}}
		>
			<TableContainer
				component={Paper}
				sx={{ maxWidth: 'xl' }}
				elevation={10}
			>
				<Table stickyHeader sx={{ minWidth: 800 }}>
					<TableHead sx={{ textTransform: 'uppercase' }}>
						<TableRow id='table-header' key='table-header'>
							<TableCell>Customer</TableCell>
							<TableCell>Email</TableCell>
							<TableCell colSpan={3} />
						</TableRow>
					</TableHead>
					<TableBody>
						{isLoadingGetUsers && (
							<TableSpinner
								SpinnerProps={{ color: 'secondary' }}
							/>
						)}
						{!isLoadingGetUsers &&
							rows.map((row) => {
								const { user_id, name, email } = row;

								return (
									<TableRow
										key={user_id}
										hover
										onClick={() => {
											setActiveUser(row);
											toggleDialog(true);
										}}
									>
										<TableCell>{name}</TableCell>
										<TableCell>{email}</TableCell>
										<TableCell>
											<Tooltip
												title='Click to see details'
												arrow
											>
												<IconButton>
													<VisibilityIcon color='secondary' />
												</IconButton>
											</Tooltip>
										</TableCell>
										{/* <TableCell>
											<LoadingButton
												variant='contained'
												color='secondary'
											>
												Do something
											</LoadingButton>
										</TableCell> */}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<Customer
				open={dialogOpen}
				customer={activeUser}
				onClose={handleCloseDialog}
			/>
		</Container>
	);
};
