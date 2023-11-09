import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';

import Chart from 'src/components/chart';


const CHART_HEIGHT = 450;
const LEGEND_HEIGHT = 120;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));


export default function SuaraPieChart({ title, subheader, chartData }) {
  const chartOptions = {
    chart: {
      type: 'donut',
      height: CHART_HEIGHT,
    },
    labels: chartData.labels,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 600, // Adjust this breakpoint as needed
      options: {
        chart: {
          width: '100%',
          height: 500 // Smaller height for mobile view
        },
        legend: {
          position: 'bottom'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%', // Smaller donut size for mobile view
            },
          },
        },
      }
    }],
    tooltip: {
      y: {
        formatter: (value) => `${value} Suara`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Suara',
              // eslint-disable-next-line
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
  };

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      {/* <Chart
        options={chartOptions}
        series={chartData.series}
        type="donut"
        height={350}
      /> */}
      <StyledChart
        type="donut"
        series={chartData.series}
        options={chartOptions}
        height={CHART_HEIGHT}
      />
    </Card>
  );
}

SuaraPieChart.propTypes = {
  chartData: PropTypes.shape({
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
