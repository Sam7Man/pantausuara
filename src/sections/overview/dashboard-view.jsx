import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import LoadingSkeleton from './components/loading-skeleton';
import RiwayatInput from './components/riwayat-input';
import SuaraPieChart from './components/suara-piechart';
import SuaraKabupatenChart from './components/suara-kabupaten-chart';
import SummaryCards from './components/summary-cards';
import SuaraBarChart from './components/suara-barchart';
import DataGrowth from './components/data-growth';

import { getSummary } from 'src/sections/authentication/api-request/GetArea';
import { getSuara } from 'src/sections/authentication/api-request/Suara';
import { getTimses } from 'src/sections/authentication/api-request/Timses';
import { toInteger } from 'lodash';
import { IconFileAnalytics, IconMap2, IconSpeakerphone, IconUsersGroup } from '@tabler/icons-react';


export default function DashboardView() {
  const [dataSummary, setDataSummary] = useState(null);
  const [dataSuara, setDataSuara] = useState(null);
  const [dataTimses, setDataTimses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await getSummary();
        const suaraData = await getSuara();
        const timsesData = await getTimses();

        setDataSummary(summaryData.data);
        setDataSuara(suaraData.data);
        setDataTimses(timsesData.data);
      } catch (caughtError) {
        console.error('Error fetching data:', caughtError);
        setError(caughtError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>There was an error loading the dashboard: {error.message}</div>;
  }

  const transformToChartData = (suaraDaerah) => {
    return {
      series: suaraDaerah.map((item) => ({
        label: item.name,
        value: toInteger(item.count)
      })),
      colors: suaraDaerah.map(() => '#b71717'),
    };
  };

  const suaraBarChartData = dataSummary?.suara_daerah
    ? transformToChartData(dataSummary.suara_daerah)
    : { series: [], colors: [] };


  const suaraPieChartData = dataSummary ? {
    series: dataSummary.suara_daerah.map((item) => item.count),
    labels: dataSummary.suara_daerah.map((item) => item.name),
  } : { series: [], labels: [] };


  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3} >
          <SummaryCards
            title="Total Suara"
            total={dataSummary?.total_suara}
            color="success"
            icon={<IconFileAnalytics color='#4299e1' size={64} stroke={1} />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCards
            title="Jumlah Daerah Suara"
            total={dataSummary?.suara_daerah.reduce((acc, curr) => acc + curr.count, 0) ?? 0}
            color="info"
            icon={<IconMap2 color='#0ca678' size={64} stroke={1} />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCards
            title="Suara Timses"
            total={dataSummary?.suara_timses.reduce((acc, curr) => acc + curr.count, 0)}
            color="warning"
            icon={<IconSpeakerphone color='#f76707' size={64} stroke={1} />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <SummaryCards
            title="Total Timses"
            total={dataSummary?.total_timses}
            color="error"
            icon={<IconUsersGroup color='#d63939' size={64} stroke={1} />}
          />
        </Grid>

        <Grid xs={12}>
          <DataGrowth />
        </Grid>

        <Grid xs={12} md={8}>
          <SuaraKabupatenChart />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <SuaraPieChart
            title="Suara Daerah"
            subheader="Percentage of votes by region"
            chartData={suaraPieChartData}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <SuaraBarChart
            title="Suara Daerah"
            subheader="Conversion rates by region"
            chart={suaraBarChartData}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <RiwayatInput
            lastSummaryInput={dataSummary.last_input}
            suaraData={dataSuara}
            timsesData={dataTimses}
          />
        </Grid>
      </Grid>
    </Container >
  );
}
