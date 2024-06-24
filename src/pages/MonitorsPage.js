import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Stack, Typography, Box } from '@mui/material';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer'; // Adjust the path as needed
import { fetchCameras, fetchActiveCameras } from '../data/slice/CameraSlice'; // Adjust the path as needed

const MonitorsPage = () => {
  const dispatch = useDispatch();
  const cameras = useSelector((state) => state.cameras.cameras);
  const activeCameras = useSelector((state) => state.cameras.activeCameras);

  useEffect(() => {
    dispatch(fetchCameras());
    dispatch(fetchActiveCameras());
  }, [dispatch]);

  if (!cameras) {
    return <div>Loading cameras...</div>;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Monitors
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          height: '70vh', // Set a specific height for the container
        }}
      >
        {activeCameras.map((camera, index) => (
          <Box
            key={camera._id}
            sx={{
              flex: index === 0 ? 3 : 1,
              marginRight: index === activeCameras.length - 1 ? 0 : '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#000',
            }}
          >
            <Box sx={{ width: '100%', height: '32%', mb: '5px' }}>
              <VideoPlayer url={camera.url} />
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default MonitorsPage; 