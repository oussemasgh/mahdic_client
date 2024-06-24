import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios'; // Adjust path as needed

export const fetchAlerts = createAsyncThunk('alerts/fetchAlerts', async () => {
  const response = await axiosInstance.get('/alerts');
  return response.data;
});

export const createAlert = createAsyncThunk('alerts/createAlert', async (newAlert) => {
  const response = await axiosInstance.post('/alerts', newAlert);
  return response.data;
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default alertsSlice.reducer;
