import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Pagination,
} from "@mui/material";

const VideoList = () => {
  const BACKEND_URI = "http://localhost:5000";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const videosPerPage = 25;

  useEffect(() => {
    axios
      .get(`${BACKEND_URI}/api/v1/media/all`)
      .then((response) => {
        console.log(response.data);
        setVideos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredVideos = videos
    .filter((media) =>
      filterName ? media.name.toLowerCase().includes(filterName.toLowerCase()) : true
    )
    .filter((media) =>
      filterDate ? new Date(media.createdAt).toLocaleDateString().includes(filterDate) : true
    );

  const displayedVideos = filteredVideos.slice(
    (page - 1) * videosPerPage,
    page * videosPerPage
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading videos</Typography>;

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Uploaded Videos</Typography>
      <Box mb={2}>
        <TextField
          label="Filter by Name"
          variant="outlined"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Filter by Date (MM/DD/YYYY)"
          variant="outlined"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </Box>
      <Grid container spacing={2}>
        {displayedVideos.map((media) =>
          media.videos.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={`${media._id}-${index}`}>
              <Box display="flex" flexDirection="column" alignItems="center" p={1}>
                <Typography variant="body1" gutterBottom>
                  {media.name} - {new Date(media.createdAt).toLocaleDateString()}
                </Typography>
                <video
                  src={`${BACKEND_URI}${video.replace(/\\/g, '/')}`}
                  width="200"
                  height="150"
                  controls
                  style={{ borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', margin: '10px' }}
                />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredVideos.length / videosPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Paper>
  );
};

export default VideoList;
