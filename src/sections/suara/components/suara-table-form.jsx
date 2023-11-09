import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Select,
    MenuItem,
    Alert,
    Divider,
    Grid
} from '@mui/material';
import { Box } from '@mui/system';

import { useSuara } from '../context/suara-context';
import { insertSuara, updateSuara } from '../../authentication/api-request/Suara';


export default function SuaraTableForm({ open, onClose, dialogMode, dataForEdit }) {
    const {
        timsesList,
        fetchTimses,
        fetchSuara,
        DIALOG_MODE
    } = useSuara();
    const [errors, setErrors] = useState({});
    const [inputMode, setInputMode] = useState('Auto');
    const [apiError, setApiError] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [selectedTimsesId, setSelectedTimsesId] = useState(dataForEdit?.timses_id || '');


    useEffect(() => {
        fetchTimses(); 
        // eslint-disable-next-line
    }, []);

    const handleTimsesChange = (event) => {
        setSelectedTimsesId(event.target.value);
    };

    const initialFormData = useMemo(() => ({
        nik: dataForEdit?.nik || '',
        nama: dataForEdit?.nama || '',
        kabupaten: dataForEdit?.kabupaten || '',
        kecamatan: dataForEdit?.kecamatan || '',
        kelurahan: dataForEdit?.kelurahan || '',
        tps: dataForEdit?.tps || '',
    }), [dataForEdit]);

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    useEffect(() => {
        if (open) {
            const isEditMode = dialogMode === DIALOG_MODE.EDIT;
            setDialogTitle(isEditMode ? 'Edit Data Suara' : 'Tambah Data Suara');
            if (isEditMode && dataForEdit) {
                setFormData({
                    nik: dataForEdit.nik,
                    nama: dataForEdit.nama,
                    kabupaten: dataForEdit.kabupaten,
                    kecamatan: dataForEdit.kecamatan,
                    kelurahan: dataForEdit.kelurahan,
                    tps: dataForEdit.tps,
                });
                setSelectedTimsesId(dataForEdit.timses_id);
            } else {
                setFormData(initialFormData);
            }
        }

        if (!open) {
            setErrors({});
        }
    }, [open, dialogMode, dataForEdit, initialFormData, DIALOG_MODE.EDIT]);


    const handleDialogClose = () => {
        setFormData(initialFormData);
        setErrors({});
        onClose();
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const submitData = {
            ...formData,
            timses_id: selectedTimsesId,
            status: inputMode === 'Manual' ? 'manual' : formData.status,
        };

        if (!selectedTimsesId) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                timses: 'Pilih Timses Terlebih Dahulu',
            }));
            return;
        }

        if (dialogMode === DIALOG_MODE.EDIT) {
            submitData.UpdatedAt = new Date().toISOString();
        }

        try {
            const validationErrors = {};

            if (!formData.nik) {
                validationErrors.nik = 'NIK field cannot be blank';
            } else if (formData.nik.length !== 16) {
                validationErrors.nik = 'Invalid NIK';
            }
            if (!formData.nama) {
                validationErrors.nama = 'Nama field cannot be blank';
            }
            if (inputMode === 'Manual') {
                const requiredFields = ['kabupaten', 'kecamatan', 'kelurahan', 'tps'];
                requiredFields.forEach((field) => {
                    if (!formData[field]) {
                        validationErrors[field] = 'This field cannot be blank';
                    }
                });
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            if (dataForEdit) {
                await updateSuara(dataForEdit.id, submitData);
                localStorage.setItem('showEditSuccessAlert', 'true');
            } else {
                await insertSuara(submitData);
                localStorage.setItem('showAddSuccessAlert', 'true');
            }

            await fetchSuara();
            handleDialogClose();
            // window.location.reload();
        } catch (error) {
            console.error('Error submitting form:', error);
            setApiError('Error submitting form');
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {dialogTitle}
                </DialogTitle>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <DialogContent>
                    {apiError && <Alert variant="filled" severity="error">{apiError}</Alert>}
                    <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(e, formData); }}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography
                                    name="select-mode"
                                    variant="subtitle1"
                                    fontWeight={600}
                                    component="label"
                                    mb={5}
                                >
                                    Input Mode
                                </Typography>
                                <Select
                                    labelId="select-mode"
                                    id="select-mode"
                                    size="small"
                                    value={inputMode}
                                    onChange={(e) => setInputMode(e.target.value)}
                                    sx={{ ml: 1 }}
                                >
                                    <MenuItem value="Auto">Auto</MenuItem>
                                    <MenuItem value="Manual">Manual</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item>
                                <Select
                                    labelId='select-timses'
                                    id='select-timses'
                                    value={selectedTimsesId}
                                    onChange={handleTimsesChange}
                                    size="small"
                                    displayEmpty
                                    required
                                    sx={{ ml: 1 }}
                                >
                                    <MenuItem value="" disabled>---Pilih Timses---</MenuItem>
                                    {timsesList.map((timsesItem) => (
                                        <MenuItem key={timsesItem.id} value={timsesItem.id}>
                                            {timsesItem.nama}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.timses && <Typography color="error">{errors.timses}</Typography>}
                            </Grid>
                        </Grid>

                        {/* Render Auto Input Mode fields */}
                        <Box mt="25px">
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="nik" mb="5px" >
                                NIK
                            </Typography>
                            <TextField
                                name="nik"
                                id="nik"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nik}
                                error={!!errors.nik}
                                helperText={errors.nik}
                                inputProps={{ maxLength: 16 }}
                            />
                        </Box>
                        <Box mt="25px">
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="nama" mb="5px">
                                Nama
                            </Typography>
                            <TextField
                                name="nama"
                                id="nama"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nama}
                                error={!!errors.nama}
                                helperText={errors.nama}
                            />
                        </Box>

                        {/* Render Manual Input Mode fields */}
                        {inputMode === 'Manual' && (
                            <>
                                <Box mt="25px">
                                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kabupaten" mb="5px">
                                        Kabupaten
                                    </Typography>
                                    <TextField
                                        name="kabupaten"
                                        id="kabupaten"
                                        fullWidth
                                        value={formData.kabupaten}
                                        onChange={handleChange}
                                        error={!!errors.kabupaten}
                                        helperText={errors.kabupaten}
                                    />
                                </Box>
                                <Box mt="25px">
                                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kecamatan" mb="5px">
                                        Kecamatan
                                    </Typography>
                                    <TextField
                                        name="kecamatan"
                                        id="kecamatan"
                                        fullWidth
                                        value={formData.kecamatan}
                                        onChange={handleChange}
                                        error={!!errors.kecamatan}
                                        helperText={errors.kecamatan}
                                    />
                                </Box>
                                <Box mt="25px">
                                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kelurahan" mb="5px">
                                        Kelurahan
                                    </Typography>
                                    <TextField
                                        name="kelurahan"
                                        id="kelurahan"
                                        fullWidth
                                        value={formData.kelurahan}
                                        onChange={handleChange}
                                        error={!!errors.kelurahan}
                                        helperText={errors.kelurahan}
                                    />
                                </Box>
                                <Box mt="25px">
                                    <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="tps" mb="5px">
                                        TPS
                                    </Typography>
                                    <TextField
                                        name="tps"
                                        id="tps"
                                        fullWidth
                                        value={formData.tps}
                                        onChange={handleChange}
                                        error={!!errors.tps}
                                        helperText={errors.tps}
                                    />
                                </Box>
                            </>
                        )}
                    </form>
                </DialogContent>
                <Divider sx={{ borderBottomWidth: 2 }} />
                <DialogActions sx={{ m: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="outlined" color="primary" onClick={(e) => { e.preventDefault(); handleFormSubmit(e, formData); }}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

SuaraTableForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    dialogMode: PropTypes.oneOf(['ADD', 'EDIT']),
    dataForEdit: PropTypes.object,
};