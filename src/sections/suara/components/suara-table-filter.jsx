import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    Divider,
    Grid
} from '@mui/material';
import { FilterListOutlined } from '@mui/icons-material';

import { useSuara } from '../context/suara-context';
import { getAreaData } from 'src/sections/authentication/api-request/GetArea';

function SuaraTableFilter() {
    const { handleFilter, resetFilters } = useSuara();
    const [open, setOpen] = useState(false);
    const [kabupaten, setKabupaten] = useState([]);
    const [kecamatan, setKecamatan] = useState([]);
    const [kelurahan, setKelurahan] = useState([]);
    const [selectedArea, setSelectedArea] = useState({ kabupaten: '', kecamatan: '', kelurahan: '', status: '' });

    const [statuses] = useState([
        { value: "not_found", label: "Data Invalid" },
        { value: "found", label: "Otomatis" },
        { value: "pending", label: "Pending" },
        { value: "manual", label: "Manual" }
    ]);

    useEffect(() => {
        getAreaData().then(response => {
            setKabupaten(response.data);
        }).catch(error => {
            console.error("Error fetching kabupaten data:", error);
        });
    }, []);

    useEffect(() => {
        if (selectedArea.kabupaten) {
            getAreaData('kabupaten', selectedArea.kabupaten).then(response => {
                setKecamatan(response.data);
            }).catch(error => {
                console.error("Error fetching kecamatan data:", error);
            });
        }
    }, [selectedArea.kabupaten]);

    useEffect(() => {
        if (selectedArea.kecamatan) {
            getAreaData('kecamatan', selectedArea.kecamatan).then(response => {
                setKelurahan(response.data);
            }).catch(error => {
                console.error("Error fetching kelurahan data:", error);
            });
        }
    }, [selectedArea.kecamatan]);

    const handleApplyFilter = () => {
        handleFilter(selectedArea);
        setOpen(false);
    };

    const handleResetFilter = () => {
        setSelectedArea({ kabupaten: '', kecamatan: '', kelurahan: '', status: '' });
        resetFilters();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedArea({ ...selectedArea, [name]: value });

        if (name === 'kabupaten') {
            setKecamatan([]);
            setKelurahan([]);
            setSelectedArea(prev => ({ ...prev, kecamatan: '', kelurahan: '' }));
        } else if (name === 'kecamatan') {
            setKelurahan([]);
            setSelectedArea(prev => ({ ...prev, kelurahan: '' }));
        }
    };


    return (
        <>
            <Button variant="outlined" color="inherit" onClick={() => setOpen(true)} startIcon={<FilterListOutlined />}>
                Filter Data
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                            <FilterListOutlined />
                        </Grid>
                        <Grid item>
                            Filter Data
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Divider sx={{ borderBottomWidth: 5 }} />
                <DialogContent>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kabupaten" mb="10px">
                            Kabupaten
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            name="kabupaten"
                            value={selectedArea.kabupaten}
                            onChange={handleChange}
                            SelectProps={{ native: true }}
                        >
                            <option value="">--Select Kabupaten--</option>
                            {kabupaten.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kecamatan" mb="10px">
                            Kecamatan
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            name="kecamatan"
                            value={selectedArea.kecamatan}
                            onChange={handleChange}
                            SelectProps={{ native: true }}
                            disabled={!selectedArea.kabupaten}
                        >
                            <option value="">--Select Kecamatan--</option>
                            {kecamatan.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="kelurahan" mb="10px">
                            Kelurahan
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            name="kelurahan"
                            value={selectedArea.kelurahan}
                            onChange={handleChange}
                            SelectProps={{ native: true }}
                            disabled={!selectedArea.kecamatan}
                        >
                            <option value="">--Select Kelurahan--</option>
                            {kelurahan.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </TextField>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="status" mb="10px">
                            Status
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            name="status"
                            value={selectedArea.status}
                            onChange={handleChange}
                            SelectProps={{ native: true }}
                        >
                            <option value="">--Select Options--</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Grid container justifyContent="space-evenly" sx={{ m: 1 }}>
                        <Grid item>
                            <Button variant="outlined" onClick={() => setOpen(false)} color="inherit">
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={handleResetFilter} color="inherit">
                                Reset
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={handleApplyFilter} color="primary">
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SuaraTableFilter;
