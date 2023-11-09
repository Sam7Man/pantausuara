import React from 'react';
import { Container, Stack, Typography, Card, CardHeader } from '@mui/material';

import LogTabs from './components/logs-tabs';

export default function FullLogsPage() {
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Full Logs</Typography>
            </Stack>

            <Card>
                <CardHeader
                    title="Logs"
                    subheader="Logs data from Suara and Timses"
                    sx={{ mb: 2 }}
                />
                <LogTabs />
            </Card>
        </Container>
    );
}
