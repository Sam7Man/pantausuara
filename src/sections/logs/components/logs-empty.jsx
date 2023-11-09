import React from 'react';
import { Typography, Box } from '@mui/material';

export default function LogsEmpty() {
    return (
        <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" align="center">
                No data available.
            </Typography>
        </Box>
    );
}
