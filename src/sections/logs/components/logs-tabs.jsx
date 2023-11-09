import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import LogsData from './logs-data';
import LogsSort from './logs-sort';
import LogsSearch from './logs-search';

import { getSuara } from 'src/sections/authentication/api-request/Suara';
import { getTimses } from 'src/sections/authentication/api-request/Timses';
import { Stack } from '@mui/material';


export default function LogTabs() {
    const [value, setValue] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleSort = (order) => {
        setSortOrder(order);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="Full Logs Tabs">
                        <Tab label="Suara" value="1" />
                        <Tab label="Timses" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
                        <LogsSearch onSearch={handleSearch} />
                        <LogsSort
                            options={[
                                { value: 'latest', label: 'Latest' },
                                { value: 'oldest', label: 'Oldest' },
                            ]}
                            onSort={handleSort}
                        />
                    </Stack>
                    <LogsData
                        fetchData={getSuara}
                        type="Suara"
                        searchQuery={searchQuery}
                        sortOrder={sortOrder}
                    />
                </TabPanel>
                <TabPanel value="2">
                    <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
                        <LogsSearch onSearch={handleSearch} />
                        <LogsSort
                            options={[
                                { value: 'latest', label: 'Latest' },
                                { value: 'oldest', label: 'Oldest' },
                            ]}
                            onSort={handleSort}
                        />
                    </Stack>
                    <LogsData
                        fetchData={getTimses}
                        type="Timses"
                        searchQuery={searchQuery}
                        sortOrder={sortOrder}
                    />
                </TabPanel>
            </TabContext>
        </Box>
    );
}