import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { TextField, Button, Box, CircularProgress, LinearProgress, Typography, Paper } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const UploadForm = () => {
  const BACKEND_URI = "http://localhost:5000";
  const [name, setName] = useState("");
  const [videos, setVideos] = useState([]);
  const [uploaded, setUploaded] = useState(null);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [nameError, setNameError] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setVideos(acceptedFiles);
    setVideoPreviews(acceptedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      setNameError(true);
      return;
    }
    
    setNameError(false);
    let formData = new FormData();
    for (let key in videos) {
      formData.append("videos", videos[key]);
    }

    formData.append("name", name);

    axios
      .post(`${BACKEND_URI}/api/v1/media/create`, formData, {
        onUploadProgress: (data) => {
          setUploaded(Math.round((data.loaded / data.total) * 100));
        },
      })
      .then(() => {
        
        setUploaded(null);
        setVideoPreviews([]);
        
        setName("");
        setVideos([]);
        alert("Submitted successfully");
      })
      .catch((error) => {
        console.error(error);
        alert("Error happened! check the name of the video or the video format");
        setUploaded(null);
      });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: ".mp4, .mkv",
    multiple: true
  });

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            helperText={nameError ? "Name is required" : ""}
          />
        </Box>

        <Box mb={2}>
          <div
            {...getRootProps({
              className: 'dropzone',
              style: {
                border: '2px dashed #3f51b5',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '4px',
                color: '#3f51b5'
              }
            })}
          >
            <input {...getInputProps()} />
            <CloudUpload style={{ fontSize: '3rem' }} />
            <Typography variant="body1">Drag & drop some files here, or click to select files</Typography>
          </div>
        </Box>

        <Box mb={2}>
          <Typography variant="h6">Video Previews</Typography>
          <Box display="flex" flexWrap="wrap" gap="16px">
            {videoPreviews.map((preview, index) => (
              <video
                key={index}
                src={preview}
                width="200"
                height="150"
                controls
                style={{ borderRadius: '4px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
              />
            ))}
          </Box>
        </Box>

        {uploaded !== null && (
          <Box mb={2}>
            <LinearProgress variant="determinate" value={uploaded} />
            <Typography variant="body2" color="textSecondary" align="center">{`${uploaded}%`}</Typography>
          </Box>
        )}

        <Box textAlign="center">
          <Button type="submit" variant="contained" color="primary" startIcon={uploaded !== null ? <CircularProgress size={24} /> : null}>
            Submit
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default UploadForm;
