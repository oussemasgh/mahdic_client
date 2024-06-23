import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { fetchCameras, clearErrors } from '../../../../data/slice/CameraSlice';
import axiosInstance from 'src/utils/axios';
import AddIcon from '@mui/icons-material/Add';

export default function CamerasPage() {
  
  const [scanResults, setScanResults] = useState([]);
  const dispatch = useDispatch();
 
  const { cameras, loading, error } = useSelector((state) => state.camera);
  const ScanCamera = async () => {
      axiosInstance.get('/camera-scanner')
      .then((response) => {
        setScanResults(response.data);
        console.log(scanResults);
      })
      .catch((error) => {
        console.error('Failed to scan cameras: ', error);
      });

  };


  const handleButtonClick = (camera) => {
    console.log(camera);
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading="Cameras"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Cameras', href: '/dashboard/room' },
          { name: 'New Camera' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Button variant="contained"  sx={{ mb: 3 }} onClick={ScanCamera}>
        Scan for Available Cameras
      </Button>
      {scanResults.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Scan Results</Typography>
          <Grid container spacing={3}>
            {scanResults.map((camera) => (
              <Grid item xs={12} sm={6} md={4} key={camera.extractedValues.id}>
                <Paper sx={{ p: 2, position: 'relative' }}>
                  <Button
                    variant="contained"
                    
                    startIcon={<AddIcon />}
                    onClick={() => handleButtonClick(camera)}
                    sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'lightGreen',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'yellow',
                        color: 'black',
                      } }}
                  >
                    Add
                  </Button>
                  <Typography variant="h6">{camera.cameraName}</Typography>
                  <Typography>Codec : {camera.extractedValues.vcodec}</Typography>
                  <Typography>IP Address : {camera.extractedValues.ip_Adrress}</Typography>
                  <Typography>Resolution : {camera.extractedValues.resolution}</Typography>
                  <Typography>fps : {camera.extractedValues.fps}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}    </Container>
  );
}
