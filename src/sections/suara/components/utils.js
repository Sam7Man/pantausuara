export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (suara) => suara.nama.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const headCells = [
  { id: 'nik', numeric: false, disablePadding: true, label: 'NIK' },
  { id: 'nama', numeric: false, disablePadding: false, label: 'Nama' },
  { id: 'kabupaten', numeric: false, disablePadding: false, label: 'Kabupaten/Kota' },
  { id: 'kecamatan', numeric: false, disablePadding: false, label: 'Kecamatan' },
  { id: 'kelurahan', numeric: false, disablePadding: false, label: 'Kelurahan' },
  { id: 'tps', numeric: false, disablePadding: false, label: 'TPS' },
  { id: 'timsesName', numeric: false, disablePadding: false, label: 'Tim Sukses' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status', },
];


export function getStatusInfo(status) {
  switch (status) {
    case 'not_found':
      return { label: 'Data Invalid', color: 'error' };
    case 'found':
      return { label: 'Otomatis', color: 'success' };
    case 'pending':
      return { label: 'Pending', color: 'warning' };
    case 'manual':
      return { label: 'Manual', color: 'info' };
    default:
      return { label: status, color: 'default' };
  }
}
