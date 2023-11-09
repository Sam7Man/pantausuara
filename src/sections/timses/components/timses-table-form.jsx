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
    Alert,
    Divider
} from '@mui/material';
import { Box } from '@mui/system';

import { insertTimses, updateTimses, getTimses } from '../../authentication/api-request/Timses';


const DIALOG_MODE = {
    ADD: 'ADD',
    EDIT: 'EDIT',
};

export default function TimsesTableForm({ open, onClose, onDataAdded, dataForEdit, dialogMode }) {
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');

    const initialFormData = useMemo(() => ({
        nama: dataForEdit?.nama || '',
        nomor_telepon: dataForEdit?.nomor_telepon || '',
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
            setDialogTitle(dialogMode === DIALOG_MODE.EDIT ? 'Edit Data Timses' : 'Tambah Data Timses');
        }

        if (dataForEdit) {
            setFormData(dataForEdit);
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    }, [open, dataForEdit, dialogMode, initialFormData]);


    const fetchTimses = async () => {
        try {
            const response = await getTimses();
            if (onDataAdded) {
                onDataAdded(response.data);
            }
        } catch (error) {
            console.error('Error fetching Timses:', error);
            setApiError('Error fetching Timses');
        }
    };

    const handleDialogClose = () => {
        setFormData(initialFormData);
        setErrors({});
        onClose();
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const validationErrors = {};
            
            const requiredFields = ['nama', 'kabupaten', 'kecamatan', 'kelurahan', 'tps'];
            if (!formData.requiredFields) {
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
                await updateTimses(dataForEdit.id, formData);
                localStorage.setItem('showEditSuccessAlert', 'true');
            } else {
                await insertTimses(formData);
                localStorage.setItem('showAddSuccessAlert', 'true');
            }

            await fetchTimses();
            handleDialogClose();
            window.location.reload();
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
                        <Box mt={1}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="nama" mb="5px">
                                Nama
                            </Typography>
                            <TextField
                                name="nama"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nama}
                                error={!!errors.nama}
                                helperText={errors.nama}
                            />
                        </Box>
                        <Box mt="25px">
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="nomor_telepon" mb="5px" >
                                Nomor Telepon
                            </Typography>
                            <TextField
                                name="nomor_telepon"
                                fullWidth
                                onChange={handleChange}
                                value={formData.nomor_telepon}
                                error={!!errors.nomor_telepon}
                                helperText={errors.nomor_telepon}
                                inputProps={{ maxLength: 13 }}
                            />
                        </Box>
                        <Box mt="25px">
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kabupaten" mb="5px">
                                Kabupaten
                            </Typography>
                            <TextField
                                name="kabupaten"
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
                                fullWidth
                                value={formData.tps}
                                onChange={handleChange}
                                error={!!errors.tps}
                                helperText={errors.tps}
                            />
                        </Box>
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

TimsesTableForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDataAdded: PropTypes.func,
    dataForEdit: PropTypes.object,
    dialogMode: PropTypes.string,
};