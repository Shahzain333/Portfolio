import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
};

const experienceSlice = createSlice({
    name: 'experiences',
    initialState,
    reducers: {
        setExperiences: (state, action) => {
            state.items = action.payload.experiences
            state.pagination = action.payload.pagination
            state.loading = false
            state.error = null
        },
        addExperience: (state, action) => {
            state.items.unshift(action.payload)
        },
        updateExperience: (state, action) => {
            const idx = state.items.findIndex(e => e._id === action.payload._id)
            if (idx !== -1) state.items[idx] = action.payload
        },
        removeExperience: (state, action) => {
            state.items = state.items.filter(e => e._id !== action.payload)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    }
})

export const { setExperiences, addExperience, updateExperience, removeExperience, setLoading, setError
} = experienceSlice.actions

export default experienceSlice.reducer