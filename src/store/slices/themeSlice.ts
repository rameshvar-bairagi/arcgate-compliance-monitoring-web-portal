import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
    setTheme(state, action) {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
