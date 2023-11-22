import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import LoadingSkeleton from './components/loading-skeleton';
import SummaryCards from './components/summary-cards';
import DataGrowth from './components/data-growth';
import RiwayatInput from './components/riwayat-input';
import SuaraPieChart from './components/suara-piechart';
import SuaraKabupatenChart from './components/suara-kabupaten-chart';
import SuaraTimsesBarChart from './components/suara-timses-barchart';

import { useUser } from '../authentication/user/user-context';
import { getSummary } from 'src/sections/authentication/api-request/GetArea';
import { getSuara } from 'src/sections/authentication/api-request/Suara';
import { getTimses } from 'src/sections/authentication/api-request/Timses';

import { IconFileAnalytics, IconMap2, IconSpeakerphone, IconUsersGroup } from '@tabler/icons-react';


export default function DashboardView() {
  const { userId } = useUser();
  const [dataSummary, setDataSummary] = useState(null);
  const [dataSuara, setDataSuara] = useState(null);
  const [dataTimses, setDataTimses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await getSummary();
        const suaraResponse = await getSuara();
        const timsesResponse = await getTimses();

        const suaraData = suaraResponse.data.filter(item => item.user_id === userId);
        const timsesData = timsesResponse.data.filter(item => item.user_id === userId);

        setDataSummary(summaryData.data);
        setDataSuara(suaraData);
        setDataTimses(timsesData);
      } catch (caughtError) {
        console.error('Error fetching data:', caughtError);
        setError(caughtError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);


  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>There was an error loading the dashboard: {error.message}</div>;
  }

  const totalSuaraTimses = dataSuara?.reduce((acc, curr) => {
    const timsesId = curr.timses_id;
    const timsesName = dataTimses.find(timses => timses.id === timsesId)?.nama || "Unknown";

    if (!acc[timsesName]) {
      acc[timsesName] = 0;
    }

    acc[timsesName]++;
    return acc;
  }, {});

  // Transform the data into the format expected by the chart
  const timsesChartData = Object.entries(totalSuaraTimses).map(([timsesName, count]) => ({
    label: `${timsesName}`,
    value: count,
  }));

  const suaraTimsesBarChartData = {
    series: timsesChartData,
    colors: timsesChartData.map(() => '#b71717'),
  };

  const suaraPieChartData = dataSummary ? {
    series: dataSummary.suara_daerah.map((item) => item.count),
    labels: dataSummary.suara_daerah.map((item) => item.name),
  } : { series: [], labels: [] };

  const totalDaerahSuara = dataSummary?.suara_daerah.reduce((acc, curr) => {
    if (!acc.includes(curr.name)) {
      acc.push(curr.name);
    }
    return acc;
  }, []).length;


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
            total={totalDaerahSuara}
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
          <DataGrowth user_id={userId} />
        </Grid>

        <Grid xs={12} md={8}>
          <SuaraKabupatenChart user_id={userId} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <SuaraPieChart
            title="Suara Daerah"
            subheader="Percentage of Suara by Daerah"
            chartData={suaraPieChartData}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <SuaraTimsesBarChart
            title="Suara Timses"
            subheader="Total Suara per Timses"
            chart={suaraTimsesBarChartData}
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
