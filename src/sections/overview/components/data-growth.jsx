import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { parseISO, format, startOfMonth, isSameMonth, isSameYear } from 'date-fns';
import { Select, MenuItem } from '@mui/material';

import { getSuara } from 'src/sections/authentication/api-request/Suara';
import { getTimses } from 'src/sections/authentication/api-request/Timses';
import DashboardCardChart from './dashboard-card-chart';

const DataGrowth = ({ user_id }) => {
    const [suaraData, setSuaraData] = useState([]);
    const [timsesData, setTimsesData] = useState([]);
    // const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM'));
    const [selectedDate, setSelectedDate] = useState('');

    const uniqueDates = useMemo(() => {
        return Array.from(new Set([...suaraData, ...timsesData]
            .map(item => format(parseISO(item.CreatedAt), 'yyyy-MM'))))
            .sort();
    }, [suaraData, timsesData]);

    useEffect(() => {
        const currentMonth = format(new Date(), 'yyyy-MM');
        if (uniqueDates.length > 0) {
            if (uniqueDates.includes(currentMonth)) {
                setSelectedDate(currentMonth);
            } else {
                setSelectedDate(uniqueDates[0]);
            }
        } else {
            setSelectedDate('');
        }
    }, [uniqueDates]);

    useEffect(() => {
        const fetchSuara = async () => {
            try {
                const response = await getSuara();
                const filteredSuara = response.data.filter(item => item.user_id === user_id);
                setSuaraData(filteredSuara);
            } catch (error) {
                console.error('Error fetching suara data:', error);
            }
        };

        const fetchTimses = async () => {
            try {
                const response = await getTimses();
                const filteredTimses = response.data.filter(item => item.user_id === user_id);
                setTimsesData(filteredTimses);
            } catch (error) {
                console.error('Error fetching timses data:', error);
            }
        };

        fetchSuara();
        fetchTimses();
    }, [user_id]);

    const processData = (data, name) => {
        const countsByDate = data.reduce((acc, item) => {
            const date = format(parseISO(item.CreatedAt), 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return {
            name,
            data: Object.entries(countsByDate).map(([date, count]) => ({ x: date, y: count }))
        };
    };

    const suaraSeries = processData(suaraData, 'Suara');
    const timsesSeries = processData(timsesData, 'Timses');

    const filterDataByDate = (series, date) => {
        if (date === '') {
            return series.data;
        }
        const startDate = startOfMonth(parseISO(`${date}-01`));
        return series.data.filter(item => {
            const itemDate = parseISO(item.x);
            return isSameMonth(itemDate, startDate) && isSameYear(itemDate, startDate);
        });
    };

    const suaraFilteredData = filterDataByDate(suaraSeries, selectedDate);
    const timsesFilteredData = filterDataByDate(timsesSeries, selectedDate);

    const options = {
        chart: {
            height: 350,
            type: 'area',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        xaxis: {
            type: 'datetime',
            categories: suaraFilteredData.map(data => data.x)
        },
        yaxis: {
            min: 0,
            labels: {
                formatter: (value) => Math.floor(value)
            }
        },
        tooltip: {
            y: {
                formatter: (value) => Math.floor(value)
            },
            x: {
                format: 'dd MMM yyyy'
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetY: 0,
            offsetX: 0,
        },
        itemMargin: {
            horizontal: 50,
            vertical: 20
        },
        // theme: {
        //     mode: theme.palette.mode
        // }
    };

    const series = [
        {
            ...suaraSeries,
            data: suaraFilteredData.map(data => data.y)
        },
        {
            ...timsesSeries,
            color: '#b71919',
            data: timsesFilteredData.map(data => data.y)
        }
    ];

    const handleDateChange = (event) => {
        const newValue = event.target.value;
        setSelectedDate(newValue === "Show All Data" ? "" : newValue);
    };

    // const uniqueDates = Array.from(new Set([...suaraData, ...timsesData].map(item => format(parseISO(item.CreatedAt), 'yyyy-MM')))).sort();

    return (
        <DashboardCardChart
            title="Data Growth Overview"
            subtitle="Growth of Suara and Timses data"
            action={
                <Select
                    labelId="date-select-label"
                    id="date-select"
                    value={selectedDate}
                    size="small"
                    onChange={handleDateChange}
                >
                    {uniqueDates.map((date, index) => (
                        <MenuItem key={index} value={date}>{format(parseISO(`${date}-01`), 'MMMM yyyy')}</MenuItem>
                    ))}
                    <MenuItem value="">Show All Data</MenuItem>
                </Select>
            }
        >
            <Chart
                options={options}
                series={series}
                type="area"
                height="350px"
            />
        </DashboardCardChart>
    );
};

DataGrowth.propTypes = {
    user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default DataGrowth;