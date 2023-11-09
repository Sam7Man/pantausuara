import React from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import Label from 'src/components/label';
import { getStatusInfo } from './utils';
import { useSuara } from '../context/suara-context';

export default function SuaraTableRow({ row, selected, handleClick }) {
  const { timsesList } = useSuara();
  const isItemSelected = selected(row.id);
  const labelId = `enhanced-table-checkbox-${row.nik}`;
  const statusInfo = getStatusInfo(row.status);

  const timsesName = timsesList.find(timses => timses.id === row.timses_id)?.nama || 'Unknown';
  

  return (
    <TableRow
      hover
      onClick={(event) => handleClick(event, row.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.nik}
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
        {row.nik}
      </TableCell>
      <TableCell align="left">{row.nama}</TableCell>
      <TableCell align="left">{row.kabupaten}</TableCell>
      <TableCell align="left">{row.kecamatan}</TableCell>
      <TableCell align="left">{row.kelurahan}</TableCell>
      <TableCell align="center">{row.tps}</TableCell>
      <TableCell align="left">{timsesName}</TableCell>
      <TableCell align="center">
        <Label color={statusInfo.color}>{statusInfo.label}</Label>
      </TableCell>
    </TableRow>
  );
}

SuaraTableRow.propTypes = {
  nik: PropTypes.string,
  nama: PropTypes.string,
  kabupaten: PropTypes.string,
  kecamatan: PropTypes.string,
  kelurahan: PropTypes.string,
  tps: PropTypes.string,
  status: PropTypes.string,
  selected: PropTypes.func,
  handleClick: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired
};