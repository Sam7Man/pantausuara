import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


export default function TableEmptyRows({ emptyRowCount, height }) {
  if (!emptyRowCount) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRowCount,
        }),
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}

TableEmptyRows.propTypes = {
  emptyRowCount: PropTypes.number,
  height: PropTypes.number,
};
