import React, { useState } from 'react';
import {
  Grid,
  Tooltip,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';
import { EditOutlined, Add, Search, DeleteForever, InfoOutlined, WarningAmberRounded } from '@mui/icons-material';

import SuaraTableForm from './suara-table-form';
import { useSuara } from '../context/suara-context';


export default function SuaraTableToolbar() {
  const {
    rows,
    selected,
    handleDelete,
    handleSearch,
    dialogMode,
  } = useSuara();
  const [open, setOpen] = useState(false);
  const [dataForEdit, setDataForEdit] = useState(null);
  const [mode, setMode] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const fieldSameSize = '45px';
  const numSelected = selected.length;

  // handle form 
  const handleFormOpen = () => {
    setMode(dialogMode);
    setOpen(true);
  };

  const handleFormClose = () => {
    setMode(null);
    setDataForEdit(null);
    setOpen(false);
  };

  const handleDeleteConfirmOpen = () => {
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };
  // -----------------------------------

  // handle data operations for buttons in the table toolbar
  const handleConfirmedDelete = () => {
    if (Array.isArray(selected) && selected.length > 0) {
      selected.forEach((id) => {
        handleDelete(id);
      });
    }
    setDeleteConfirmOpen(false);
  };

  const handleEdit = () => {
    if (selected.length === 1) {
      const selectedItem = rows.find((row) => row.id === selected[0]);
      if (selectedItem) {
        setDataForEdit(selectedItem);
        setMode('EDIT');
        setOpen(true);
      }
    }
  };
  // ----------------------------------------

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >

      {numSelected > 0 ? (
        <Typography sx={{ flex: 'flex-start' }} color="inherit" variant="subtitle1" component="div">
          {numSelected}&nbsp;selected
        </Typography>
      ) : (
        <Typography sx={{ flex: 'flex-start' }} variant="h4" id="tableTitle" component="div">
          Suara
        </Typography>
      )}

      <Grid container spacing={1} justifyContent="flex-end" sx={{ mr: 1 }}>
        <Grid item>
          <Tooltip title="Search">
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search.."
              color="primary"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { xs: '100px', sm: '100px', md: '700px' },
                height: fieldSameSize,
                '& .MuiInputBase-root': {
                  height: '100%',
                },
              }}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Tooltip>
        </Grid>
        {numSelected === 1 && (
          <>
            <Grid item>
              <Tooltip title="Edit">
                <Button
                  variant="outlined"
                  onClick={handleEdit}
                  sx={{
                    height: fieldSameSize,
                    '& .MuiInputBase-root': {
                      height: '100%',
                    },
                    borderColor: 'darkorange',
                    color: 'darkorange',
                    "&:hover": {
                      borderColor: 'darkorange'
                    }
                  }}
                >
                  <EditOutlined fontSize="small" />&nbsp; Edit
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Delete">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDeleteConfirmOpen}
                  sx={{
                    height: fieldSameSize,
                    '& .MuiInputBase-root': {
                      height: '100%',
                    },
                  }}
                >
                  <DeleteForever fontSize="small" /> Hapus
                </Button>
              </Tooltip>
            </Grid>
          </>
        )}
        {numSelected === 0 && (
          <Grid item>
            <Tooltip title="Tambah Data">
              <Button
                variant="outlined"
                color="info"
                onClick={() => handleFormOpen('ADD')}
                sx={{
                  height: fieldSameSize,
                  '& .MuiInputBase-root': {
                    height: '100%',
                  },
                }}
              >
                <Add /> Tambah Data
              </Button>
            </Tooltip>
          </Grid>
        )}
        {numSelected > 1 && (
          <Grid item>
            <Tooltip title="Delete">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDeleteConfirmOpen}
                sx={{
                  height: fieldSameSize,
                  '& .MuiInputBase-root': {
                    height: '100%',
                  },
                }}
              >
                <DeleteForever fontSize="small" /> Hapus
              </Button>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <SuaraTableForm
        open={open}
        onClose={handleFormClose}
        dialogMode={mode}
        dataForEdit={dataForEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose} maxWidth="lg" >
        <DialogTitle>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <InfoOutlined />
            </Grid>
            <Grid item>
              Confirm Deletion
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <DialogContent>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <WarningAmberRounded style={{ fontSize: 100 }} color="warning" />
            </Grid>
            <Grid item>
              <DialogContentText variant="subtitle1">
                Are you sure want to delete the selected data?
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider sx={{ borderBottomWidth: 2 }} />
        <DialogActions sx={{ m: 1 }}>
          <Button variant="outlined" color="inherit" onClick={handleDeleteConfirmClose}>
            Cancel
          </Button>
          <Button variant="outlined" color="primary" onClick={handleConfirmedDelete}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Toolbar >
  );
}