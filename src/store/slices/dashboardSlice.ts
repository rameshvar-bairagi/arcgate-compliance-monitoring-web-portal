import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
  filters: {
    dateRange: string;
    status: string[];
    clientGroup: string;
  };
}

const initialState: DashboardState = {
  filters: {
    dateRange: '',
    status: [],
    clientGroup: ''
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange(state, action: PayloadAction<string>) {
      state.filters.dateRange = action.payload;
    },
    setStatus(state, action: PayloadAction<string[]>) {
      state.filters.status = action.payload;
    },
    setClientGroup(state, action: PayloadAction<string>) {
      state.filters.clientGroup = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    }
  }
});

export const { setDateRange, setStatus, setClientGroup, resetFilters } = dashboardSlice.actions;
export default dashboardSlice.reducer;