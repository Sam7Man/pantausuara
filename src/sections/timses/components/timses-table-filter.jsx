import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

function TimsesTableFilter({ onFilter, resetFilters, fullData }) {
    const [open, setOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState({ kabupaten: '', kecamatan: '', kelurahan: '' });

    // Extract unique values for dropdowns from fullData
    const uniqueKabupatens = Array.from(new Set(fullData.map(item => item.kabupaten))).sort();
    const uniqueKecamatans = Array.from(new Set(fullData.map(item => item.kecamatan))).sort();
    const uniqueKelurahans = Array.from(new Set(fullData.map(item => item.kelurahan))).sort();

    const handleApplyFilter = () => {
        onFilter(selectedArea);
        setOpen(false);
    };

    const handleResetFilter = () => {
        setSelectedArea({ kabupaten: '', kecamatan: '', kelurahan: '' });
        resetFilters();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedArea({ ...selectedArea, [name]: value });
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
                    {/* Kabupaten Dropdown */}
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
                            {uniqueKabupatens.map((kabupaten) => (
                                <option key={kabupaten} value={kabupaten}>
                                    {kabupaten}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    
                    {/* Kecamatan Dropdown */}
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
                            disabled={false}
                        >
                            <option value="">--Select Kecamatan--</option>
                            {uniqueKecamatans.map((kecamatan) => (
                                <option key={kecamatan} value={kecamatan}>
                                    {kecamatan}
                                </option>
                            ))}
                        </TextField>
                    </Box>

                    {/* Kelurahan Dropdown */}
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
                            disabled={false}
                        >
                            <option value="">--Select Kelurahan--</option>
                            {uniqueKelurahans.map((kelurahan) => (
                                <option key={kelurahan} value={kelurahan}>
                                    {kelurahan}
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

TimsesTableFilter.propTypes = {
    onFilter: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
    fullData: PropTypes.array.isRequired
};

export default TimsesTableFilter;
