import { CircularProgress, TableCell, TableRow } from '@mui/material';

import type {
	CircularProgressProps,
	TableCellProps,
	TableRowProps,
} from '@mui/material';

interface TableSpinnerProps {
	TableCellProps?: TableCellProps;
	TableRowProps?: TableRowProps;
	SpinnerProps?: CircularProgressProps;
}

export const TableSpinner = ({
	SpinnerProps,
	TableCellProps,
	TableRowProps,
}: TableSpinnerProps) => {
	return (
		<TableRow {...TableRowProps}>
			<TableCell
				align='center'
				colSpan={6}
				sx={{ py: 16 }}
				{...TableCellProps}
			>
				<CircularProgress
					size={72}
					{...(SpinnerProps as CircularProgressProps)}
				/>
			</TableCell>
		</TableRow>
	);
};
