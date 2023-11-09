import React, { useEffect, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { LinearProgress, Alert, Divider } from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { getTimses, deleteTimses } from 'src/sections/authentication/api-request/Timses';

import TableNoData from './components/table-no-data';
import TableEmptyRows from './components/table-empty-rows';
import TimsesTableRow from './components/timses-table-row';
import TimsesTableHead from './components/timses-table-head';
import TimsesTableToolbar from './components/timses-table-toolbar';
import TimsesTableForm from './components/timses-table-form';
import TimsesTableFilter from './components/timses-table-filter';
import { applyFilter, getComparator, headCells } from './components/utils';


const DIALOG_MODE = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

export default function TimsesPage() {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nama');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [dialogMode, setDialogMode] = useState(null);
  const [clientFilteredRows, setClientFilteredRows] = useState([]);

  const fetchTimses = useCallback(async () => {
    try {
      const response = await getTimses(searchQuery);
      setRows(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (localStorage.getItem('showAddSuccessAlert') === 'true') {
      setShowAddAlert(true);
      localStorage.removeItem('showAddSuccessAlert');
    } else if (localStorage.getItem('showEditSuccessAlert') === 'true') {
      setShowEditAlert(true);
      localStorage.removeItem('showEditSuccessAlert');
    }

    fetchTimses();
  }, [fetchTimses]);


  // ---- handle filter data in the table ----
  const filteredRows = rows.filter((row) => (
    row.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.nomor_telepon.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.kabupaten.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.kelurahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.tps.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const rowsToRender = clientFilteredRows.length > 0 ? clientFilteredRows : filteredRows;

  const sortedAndFilteredRows = applyFilter({
    inputData: rowsToRender,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const handleFilter = (filterData) => {
    const newFilteredRows = rows.filter(row => (
      (!filterData.kabupaten || row.kabupaten === filterData.kabupaten) &&
      (!filterData.kecamatan || row.kecamatan === filterData.kecamatan) &&
      (!filterData.kelurahan || row.kelurahan === filterData.kelurahan)
    ));
    setClientFilteredRows(newFilteredRows);
    applySearch(newFilteredRows);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const resetFilters = () => {
    setFilterName('');
    setSearchQuery('');
    setClientFilteredRows([]);
  };
  // --------------------------------

  // handle sort data in the table
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  // --------------------------------

  // ---- handle selected data in the table ----
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  // ------------------------------------------

  // ---- handle toolbar state in the table ----
  const applySearch = (data) => {
    const searchLowercased = searchQuery.toLowerCase();
    const searchedAndFilteredRows = data.filter((row) => (
      row.nama.toLowerCase().includes(searchLowercased) ||
      row.nomor_telepon.toLowerCase().includes(searchLowercased) ||
      row.kabupaten.toLowerCase().includes(searchLowercased) ||
      row.kecamatan.toLowerCase().includes(searchLowercased) ||
      row.kelurahan.toLowerCase().includes(searchLowercased) ||
      row.tps.toLowerCase().includes(searchLowercased)
    ));
    setClientFilteredRows(searchedAndFilteredRows);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
    applySearch(clientFilteredRows.length > 0 ? clientFilteredRows : rows);
  };
  // const handleSearch = (query) => {
  //   setSearchQuery(query);
  //   setPage(0);

  //   if (query) {
  //     const searchLowercased = query.toLowerCase();
  //     const newFilteredRows = clientFilteredRows.length > 0 ? clientFilteredRows : rows;
  //     const searchedRows = newFilteredRows.filter((row) => (
  //       row.nama.toLowerCase().includes(searchLowercased) ||
  //       row.nomor_telepon.toLowerCase().includes(searchLowercased) ||
  //       row.kabupaten.toLowerCase().includes(searchLowercased) ||
  //       row.kecamatan.toLowerCase().includes(searchLowercased) ||
  //       row.kelurahan.toLowerCase().includes(searchLowercased) ||
  //       row.tps.toLowerCase().includes(searchLowercased)
  //     ));

  //     setClientFilteredRows(searchedRows);
  //   } else {
  //     setClientFilteredRows(rows);
  //   }
  // };
  // --------------------------------

  // ---- handle CRUD in the table ----
  const handleClose = () => {
    setDialogMode(null);
    setDataForEdit(null);
  };

  const handleEdit = async (id) => {
    const dataToEdit = rows.find((row) => row.id === id);
    setDataForEdit(dataToEdit);
    setDialogMode(DIALOG_MODE.EDIT);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTimses(id);
      setShowDeleteAlert(true);
      setSelected([]);
      fetchTimses();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  // -------------------------------------

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">Timses</Typography>
        <TimsesTableFilter
          onFilter={handleFilter}
          resetFilters={resetFilters}
          fullData={rows}
        />
      </Stack>

      {showAddAlert && (
        <Alert
          variant="filled"
          severity="success"
          onClose={() => setShowAddAlert(false)}
          sx={{ marginBottom: 2 }}
        >
          Data successfully added!
        </Alert>
      )}
      {showEditAlert && (
        <Alert
          variant="filled"
          severity="success"
          onClose={() => setShowEditAlert(false)}
          sx={{ marginBottom: 2 }}
        >
          Data successfully edited!
        </Alert>
      )}
      {showDeleteAlert && (
        <Alert
          variant="filled"
          severity="success"
          onClose={() => setShowDeleteAlert(false)}
          sx={{ marginBottom: 2 }}
        >
          Data successfully deleted!
        </Alert>
      )}
      <TimsesTableForm
        open={dialogMode !== null}
        onClose={handleClose}
        onDataAdded={fetchTimses}
        dataForEdit={dataForEdit}
        dialogMode={dialogMode}
        DIALOG_MODE={DIALOG_MODE}
      />
      <Card>
        <TimsesTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onSearch={handleSearch}
          onDelete={handleDelete}
          onEdit={handleEdit}
          selected={selected}
          rows={filteredRows}
        />

        {loading ? (
          <LinearProgress color="inherit" />
        ) : (
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset', height: 'calc(20px * (rowsPerPage + 1))' }}>
              <Table sx={{ minWidth: 800 }}>
                <TimsesTableHead
                  order={order}
                  orderBy={orderBy}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={filteredRows ? filteredRows.length : 0}
                  headLabel={headCells}
                />
                <TableBody>
                  {sortedAndFilteredRows.length === 0 ? (
                    <TableNoData query={searchQuery} />
                  ) : (
                    <>
                      {sortedAndFilteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TimsesTableRow
                            key={row.id}
                            nama={row.nama}
                            nomor_telepon={row.nomor_telepon}
                            kabupaten={row.kabupaten}
                            kecamatan={row.kecamatan}
                            kelurahan={row.kelurahan}
                            tps={row.tps}
                            selected={isSelected}
                            handleClick={handleRowClick}
                            row={row}
                          />
                        ))}
                      <TableEmptyRows emptyRowCount={emptyRows} height={20} />
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}

        <Divider />
        <TablePagination
          page={page}
          component="div"
          count={rowsToRender.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, { value: rowsToRender.length, label: 'All' }]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
