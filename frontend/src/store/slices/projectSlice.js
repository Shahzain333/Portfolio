import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    pagination: null,
    loading: false,
    error: null,
    searchResults: [],
}

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.items = action.payload.projects;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        addProject: (state, action) => {
            state.items.unshift(action.payload)
        },
        updateProject: (state, action) => {
            const idx = state.items.findIndex(p => p._id === action.payload._id);
            if (idx !== -1) state.items[idx] = action.payload;
        },
        removeProject: (state, action) => {
            state.items = state.items.filter(p => p._id !== action.payload);
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        clearSearch: (state) => {
            state.searchResults = [];
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
})

export const { setProjects, addProject, updateProject, removeProject,
  setSearchResults, clearSearch, setLoading, setError } = projectSlice.actions

export default projectSlice.reducer