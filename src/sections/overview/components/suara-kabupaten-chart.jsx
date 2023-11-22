import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { Select, MenuItem } from '@mui/material';

import { getSuara } from 'src/sections/authentication/api-request/Suara';
import DashboardCardChart from './dashboard-card-chart';

const SuaraKabupatenChart = ({ user_id }) => {
    const [suaraData, setSuaraData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    // const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM'));

    const uniqueDates = useMemo(() => {
        return Array.from(new Set(suaraData
            .map(item => format(parseISO(item.CreatedAt), 'yyyy-MM'))))
            .sort();
    }, [suaraData]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSuara();
                setSuaraData(response.data.filter(item => item.user_id === user_id));
            } catch (error) {
                console.error('Error fetching suara data:', error);
            }
        };
    
        fetchData();
    }, [user_id]);


    useEffect(() => {
        const currentMonth = format(new Date(), 'yyyy-MM');
        if (uniqueDates.includes(currentMonth)) {
            setSelectedDate(currentMonth);
        } else if (uniqueDates.length > 0) {
            setSelectedDate(uniqueDates[0]);
        } else {
            setSelectedDate('');
        }
    }, [uniqueDates]);


    useEffect(() => {
        const filterData = () => {
            if (selectedDate === '') {
                setFilteredData(suaraData);
            } else {
                const startDate = startOfMonth(parseISO(`${selectedDate}-01`));
                const endDate = endOfMonth(startDate);
                const filtered = suaraData.filter((item) => {
                    const itemDate = parseISO(item.CreatedAt);
                    return itemDate >= startDate && itemDate <= endDate;
                });

                setFilteredData(filtered);
            }
        };

        filterData();
    }, [suaraData, selectedDate]);

    const handleDateChange = (event) => {
        const newValue = event.target.value;
        if (uniqueDates.includes(newValue) || newValue === '') {
            setSelectedDate(newValue);
        }
    };

    const theme = useTheme();
    const primary = theme.palette.primary.main;

    const totalCountsByKabupaten = (data) => {
        const counts = data.reduce((acc, item) => {
            acc[item.kabupaten] = (acc[item.kabupaten] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([kabupaten, count]) => ({
            kabupaten,
            count,
        }));
    };

    const aggregatedData = totalCountsByKabupaten(filteredData);

    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Alegreya Sans', sans-serif;",
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: 'butt',
            colors: [""],
        },
        dataLabels: {
            enabled: true,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.2)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: (value) => Math.floor(value),
                style: {
                    fontSize: '15px',
                    colors: 'rgba(0,0,0,0.7)',
                },
            },
        },
        xaxis: {
            labels: {
                style: {
                    fontSize: '13px',
                    colors: 'rgba(0,0,0,0.7)',
                },
            },
            categories: aggregatedData.map((item) => item.kabupaten),
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

    const seriescolumnchart = [
        {
            name: 'Total Suara:',
            data: aggregatedData.map((item) => item.count),
        },
    ];

    return (
        <DashboardCardChart
            title="Suara Overview"
            subtitle="Suara Daerah per Kabupaten/Kota"
            action={
                <Select
                    labelId="date-dd"
                    id="date-dd"
                    value={selectedDate}
                    size="small"
                    onChange={handleDateChange}
                >
                    {uniqueDates.map((date, index) => (
                        <MenuItem key={index} value={date}>
                            {format(parseISO(`${date}-01`), 'MMMM yyyy')}
                        </MenuItem>
                    ))}
                    <MenuItem value="">Show All Data</MenuItem>
                </Select>
            }
        >
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCardChart>
    );
};

SuaraKabupatenChart.propTypes = {
    user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default SuaraKabupatenChart;