import React from 'react';
import PropTypes from 'prop-types';

import { format, utcToZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Card, CardContent, Typography, Button } from '@mui/material';

import Label from 'src/components/label/label';


const RiwayatInput = ({ lastSummaryInput, suaraData, timsesData }) => {
  const combinedData = [
    ...suaraData.map(item => ({ ...item, type: 'suara' })),
    ...timsesData.map(item => ({ ...item, type: 'timses' }))
  ].sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));


  const formatIndonesianDate = (dateString) => {
    const zonedDate = utcToZonedTime(dateString, 'Asia/Jakarta');
    const dateFormat = format(zonedDate, 'eeee, dd/MM/yyyy', { timeZone: 'Asia/Jakarta', locale: id });
    const timeFormat = format(zonedDate, 'HH:mm \'WIB\'', { timeZone: 'Asia/Jakarta', locale: id });

    return `${dateFormat}\n${timeFormat}`;
  };


  const isEdited = (CreatedAt, UpdatedAt) => {
    return UpdatedAt && new Date(UpdatedAt) > new Date(CreatedAt);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Recent Actions</Typography>
        <Typography variant="body1">Last Input: {formatIndonesianDate(lastSummaryInput)}</Typography>
        <Timeline position="right">
          {combinedData.slice(0, 4).map((item, index) => (
            <TimelineItem key={item.id}>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  {formatIndonesianDate(isEdited(item.CreatedAt, item.UpdatedAt) ? item.UpdatedAt : item.CreatedAt)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot variant="outlined" color={item.type === 'suara' ? 'info' : 'primary'} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Label color={item.type === 'suara' ? 'info' : 'primary'}>{item.type === 'suara' ? 'Suara' : 'Timses'}</Label>
                <Typography>
                  {item.type === 'suara' ? 'Suara Masuk' : 'Timses Baru'} dari {item.kabupaten}, {item.kecamatan}, {item.kelurahan}
                  {isEdited(item.CreatedAt, item.UpdatedAt) && ' (Data di Edit)'}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <Button variant="contained" color="primary" href='/logs' fullWidth style={{ marginTop: '1rem' }}>
          Lihat Selengkapnya
        </Button>
      </CardContent>
    </Card>
  );
};

RiwayatInput.propTypes = {
  lastSummaryInput: PropTypes.string, // You should replace 'any' with the actual type expected for this prop.
  suaraData: PropTypes.array.isRequired, // Assuming suaraData is an array and is required.
  timsesData: PropTypes.array.isRequired, // Assuming timsesData is an array and is required.
};

export default RiwayatInput;
