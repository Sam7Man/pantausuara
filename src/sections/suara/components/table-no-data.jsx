import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
            padding: 2,
            margin: 'auto',
            maxWidth: 400
          }}
        >
          <Typography variant="h6" paragraph>
            Data tidak ada/ditemukan
          </Typography>

          <Typography variant="body2">
            Tidak ada hasil yang ditemukan untuk &nbsp;
            <strong>&quot;{query}&quot;</strong>.
            <br /> Coba periksa apakah ada kesalahan pengetikan.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
