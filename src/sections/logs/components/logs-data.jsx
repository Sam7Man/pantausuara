import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import { id } from 'date-fns/locale';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Typography, Box, Paper, TablePagination, CircularProgress } from '@mui/material';

import LogsEmpty from './logs-empty';
import Label from 'src/components/label';

LogsData.propTypes = {
    fetchData: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['Suara', 'Timses']).isRequired,
    searchQuery: PropTypes.string.isRequired,
    sortOrder: PropTypes.string.isRequired,
};

export default function LogsData({ fetchData, type, searchQuery, sortOrder }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await fetchData();
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
            setLoading(false);
        };

        fetchLogs();
    }, [fetchData]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatIndonesianDate = (dateString) => {
        const zonedDate = utcToZonedTime(dateString, 'Asia/Jakarta');
        const dateFormat = format(zonedDate, 'eeee, dd MMM yyyy', { timeZone: 'Asia/Jakarta', locale: id });
        const timeFormat = format(zonedDate, 'HH.mm \'WIB\'', { timeZone: 'Asia/Jakarta', locale: id });

        return `${dateFormat} - ${timeFormat}`;
    };

    const searchFilter = (log) => {
        const dateStr = formatIndonesianDate(log.CreatedAt).toLowerCase();
        const query = searchQuery.toLowerCase();
        return (
            log.nama.toLowerCase().includes(query) ||
            log.kabupaten.toLowerCase().includes(query) ||
            log.kecamatan.toLowerCase().includes(query) ||
            log.kelurahan.toLowerCase().includes(query) ||
            dateStr.includes(query)
        );
    };

    const filteredLogs = logs.filter(searchFilter);

    const sortedLogs = filteredLogs.sort((a, b) => {
        if (sortOrder === 'latest') {
            return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        }
        return new Date(a.CreatedAt) - new Date(b.CreatedAt);
    });


    const paginatedLogs = sortedLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Box textAlign="center">
                        <CircularProgress />
                        <Typography variant="caption" display="block">
                            Loading...
                        </Typography>
                    </Box>
                </Box>
            )}
            <Timeline align="right">
                {!loading && paginatedLogs.length > 0 ? (
                    paginatedLogs.map((log, index) => {
                        const isLast = index === paginatedLogs.length - 1;
                        const dotColor = type === 'Suara' ? 'info' : 'error';

                        return (
                            <React.Fragment key={log.id}>
                                <TimelineItem>
                                    <TimelineOppositeContent variant="subtitle1">
                                        <Label color={dotColor}>
                                            Created At
                                        </Label>
                                        <Typography variant="subtitle1">
                                            {formatIndonesianDate(log.CreatedAt)}
                                        </Typography>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot variant="filled" color={dotColor} />
                                        {!isLast && <TimelineConnector />}
                                    </TimelineSeparator>
                                    <TimelineContent sx={{ mr: 1 }}>
                                        <Typography>
                                            {type === 'Suara' ? `Suara masuk atas nama: ${log.nama} dari ${log.kabupaten}, ${log.kecamatan}, ${log.kelurahan}.` :
                                                `${log.nama} dari ${log.kabupaten}, ${log.kecamatan}, ${log.kelurahan}. Telah ditambahkan ke dalam Tim Sukses`}
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                                {log.UpdatedAt && log.UpdatedAt !== log.CreatedAt && (
                                    <TimelineItem>
                                        <TimelineOppositeContent variant="subtitle1">
                                            <Label color="warning">
                                                Updated At
                                            </Label>
                                            <Typography variant="subtitle1">
                                                {formatIndonesianDate(log.UpdatedAt)}
                                            </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot variant="filled" color="warning" />
                                            {!isLast && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent sx={{ mr: 1 }}>
                                            <Typography>
                                                Update recorded for {log.nama}.
                                            </Typography>
                                        </TimelineContent>
                                    </TimelineItem>
                                )}
                            </React.Fragment>
                        );
                    })
                ) : (
                    <LogsEmpty />
                )}
            </Timeline>
            {!loading && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    component="div"
                    count={sortedLogs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
}
