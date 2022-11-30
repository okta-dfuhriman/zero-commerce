import { CircularProgress, TableCell, TableRow } from '@mui/material';

import { OktaSpinner } from './OktaSpinner';

import type {
	CircularProgressProps,
	TableCellProps,
	TableRowProps,
} from '@mui/material';
import type { OktaSpinnerProps } from './OktaSpinner';

interface TableSpinnerProps {
	variant?: 'okta' | 'mui';
	TableCellProps?: TableCellProps;
	TableRowProps?: TableRowProps;
	SpinnerProps?: CircularProgressProps | OktaSpinnerProps;
}

export const TableSpinner = ({
	SpinnerProps,
	TableCellProps,
	TableRowProps,
	variant = 'mui',
}: TableSpinnerProps) => {
	return (
		<TableRow {...TableRowProps}>
			<TableCell
				align='center'
				colSpan={6}
				sx={{ py: 16 }}
				{...TableCellProps}
			>
				{variant === 'okta' && (
					<span style={{ display: 'inline-block' }}>
						<OktaSpinner
							className='okta-spinner okta-table-spinner'
							{...(SpinnerProps as OktaSpinnerProps)}
						/>
					</span>
				)}
				{variant === 'mui' && (
					<CircularProgress
						size={72}
						{...(SpinnerProps as CircularProgressProps)}
					/>
				)}
			</TableCell>
		</TableRow>
	);
};
