import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlerts } from '../../../data/slice/alertsSlice'; // Adjust path as needed
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { fToNow } from '../../../utils/formatTime';
import { CleaningServices } from '@mui/icons-material';

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function AppNewsUpdate({ title, subheader, ...other }) {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alerts.list);
  const alertsStatus = useSelector((state) => state.alerts.status);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (alertsStatus === 'idle') {
      dispatch(fetchAlerts());
      console.log('fetching alerts');
    }
  }, [alertsStatus, dispatch]);
  

  const sortedAlerts = alerts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedAlerts = sortedAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalPages = Math.ceil(sortedAlerts.length / pageSize);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {paginatedAlerts.map((alert) => (
            <NewsItem key={alert._id} alert={alert} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        {currentPage > 1 && (
          <Button size="small" color="inherit" onClick={handlePrevPage}>
            Previous
          </Button>
        )}
        {currentPage < totalPages && (
          <Button size="small" color="inherit" onClick={handleNextPage}>
            Next
          </Button>
        )}
      </Box>
    </Card>
  );
}

// NewsItem component remains the same

NewsItem.propTypes = {
  alert: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};

function NewsItem({ alert }) {
  const { name, description, location, createdAt } = alert;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {name}
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {description}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {location}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(new Date(createdAt))}
      </Typography>
    </Stack>
  );
}
