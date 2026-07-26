import { createSlice } from '@reduxjs/toolkit';

const applyTheme = (mode) => {
  if (mode === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
  localStorage.setItem('theme', mode);
};

const saved = typeof window !== 'undefined'
  ? (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches 
  ? 'dark' : 'light')) : 'light';

applyTheme(saved); // apply immediately before React renders

const themeSlice = createSlice({
  name: 'theme',
  initialState: { 
    mode: saved 
  },
  reducers: {
    toggleTheme: state => {
      const next = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = next;
      applyTheme(next);
    },
    initTheme: state => { 
      applyTheme(state.mode); 
    }
  }
});

export const { toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
