import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import userReducer from "./slice/userSlice";
import cameraSlice from "./slice/CameraSlice";
import alertsReducer from "./slice/alertsSlice";

export const store = configureStore({
  reducer: {

    auth: authReducer,
    user: userReducer,
    cameras :cameraSlice,
    alerts: alertsReducer,
   
  },
});