import React from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';


export default function TimsesTableRow({
  selected,
  nama,
  nomor_telepon,
  kabupaten,
  kecamatan,
  kelurahan,
  tps,
  handleClick,
  row
}) {
  const isItemSelected = selected(row.id);
  const labelId = `enhanced-table-checkbox-${nama}`;

  return (
    <TableRow
      hover
      onClick={(event) => handleClick(event, row.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={nama}
      selected={isItemSelected}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        {nama}
      </TableCell>
      <TableCell align="left">{nomor_telepon}</TableCell>
      <TableCell align="left">{kabupaten}</TableCell>
      <TableCell align="left">{kecamatan}</TableCell>
      <TableCell align="left">{kelurahan}</TableCell>
      <TableCell align="center">{tps}</TableCell>
    </TableRow>
  );
}

TimsesTableRow.propTypes = {
  nama: PropTypes.string,
  nomor_telepon: PropTypes.string,
  kabupaten: PropTypes.string,
  kecamatan: PropTypes.string,
  kelurahan: PropTypes.string,
  tps: PropTypes.string,
  selected: PropTypes.func,
  handleClick: PropTypes.func,
  row: PropTypes.object.isRequired
};