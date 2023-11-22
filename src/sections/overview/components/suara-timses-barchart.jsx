import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';
import Chart, { useChart } from 'src/components/chart';


export default function SuaraTimsesBarChart({ title, subheader, chart, ...other }) {
  const { colors, series } = chart;
  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      type: 'bar',
      fontFamily: "'Alegreya Sans', sans-serif;",
      toolbar: {
          show: true,
      },
    },
    colors,
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => 'Suara: ',
        },
      },
      style: {
        fontSize: '14px',
        colors: 'rgba(0,0,0,0.7)',
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 5,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: 'rgba(0,0,0,0.7)',
        },
      }
    },
    xaxis: {
      categories: series.map((i) => i.label),
      labels: {
        formatter: (value) => Math.floor(value),
        style: {
          fontSize: '14px',
          colors: 'rgba(0,0,0,0.7)',
        },
      }
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

SuaraTimsesBarChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
