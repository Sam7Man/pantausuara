import React from 'react';
import { Grid, Skeleton, Box } from '@mui/material';

const LoadingSkeleton = () => {
    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {/* Summary cards */}
                {Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Skeleton variant="rounded" height={118} />
                    </Grid>
                ))}

                {/* Data growth chart */}
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height={320} />
                </Grid>

                {/* Suara Kabupaten Chart */}
                <Grid item xs={12} md={8}>
                    <Skeleton variant="rectangular" height={400} />
                </Grid>

                {/* Suara Pie Chart */}
                <Grid item xs={12} md={6} lg={4}>
                    <Skeleton variant="rectangular" height={360} />
                </Grid>

                {/* Suara Bar Chart */}
                <Grid item xs={12} md={6} lg={8}>
                    <Skeleton variant="rectangular" height={360} />
                </Grid>

                {/* Riwayat Input */}
                <Grid item xs={12} md={6} lg={4}>
                    <Skeleton variant="rectangular" height={360} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoadingSkeleton;
