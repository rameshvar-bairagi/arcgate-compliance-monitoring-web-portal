import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from '@/store/slices/themeSlice';
import dashboardReducer from '@/store/slices/dashboardSlice';
import authReducer from '@/store/slices/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  dashboard: dashboardReducer,
});

export default rootReducer;
