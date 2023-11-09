import React, { useEffect } from 'react';

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
import TableNoData from './components/table-no-data';
import TableEmptyRows from './components/table-empty-rows';
import SuaraTableRow from './components/suara-table-row';
import SuaraTableHead from './components/suara-table-head';
import SuaraTableToolbar from './components/suara-table-toolbar';
import SuaraTableForm from './components/suara-table-form';
import SuaraTableFilter from './components/suara-table-filter';

import { headCells } from './components/utils';
import { useSuara } from './context/suara-context';


export default function SuaraPage() {
  const {
    rows,
    loading,
    fetchSuara,
    page,
    setPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    rowsPerPage,
    statusFilter,
    setStatusFilter,
    resetFilters,
    filterName,
    handleFilterByName,
    handleFilter,
    handleSearch,
    handleDelete,
    handleEdit,
    searchQuery,
    setRowsPerPage,
    selected,
    setSelected,
    showAddAlert,
    setShowAddAlert,
    showEditAlert,
    setShowEditAlert,
    showDeleteAlert,
    setShowDeleteAlert,
    dataForEdit,
    setDataForEdit,
    dialogMode,
    setDialogMode,
    filteredRows,
    sortedAndFilteredRows,
    rowsToRender,
    DIALOG_MODE,
  } = useSuara();


  useEffect(() => {
    if (localStorage.getItem('showAddSuccessAlert') === 'true') {
      setShowAddAlert(true);
      localStorage.removeItem('showAddSuccessAlert');
    } else if (localStorage.getItem('showEditSuccessAlert') === 'true') {
      setShowEditAlert(true);
      localStorage.removeItem('showEditSuccessAlert');
    }

    fetchSuara();
  }, [fetchSuara, setShowAddAlert, setShowEditAlert]);


  // handle sort data in the table
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  // handle dialog close
  const handleClose = () => {
    setDialogMode(null);
    setDataForEdit(null);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">Suara</Typography>
        <SuaraTableFilter
          onFilter={handleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          resetFilters={resetFilters}
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
      <SuaraTableForm
        open={dialogMode !== null}
        onClose={handleClose}
        onDataAdded={fetchSuara}
        dataForEdit={dataForEdit}
        dialogMode={dialogMode}
        DIALOG_MODE={DIALOG_MODE}
      />
      <Card>
        <SuaraTableToolbar
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
                <SuaraTableHead
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
                          <SuaraTableRow
                            key={row.id}
                            row={row}
                            selected={isSelected}
                            handleClick={handleRowClick}
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
