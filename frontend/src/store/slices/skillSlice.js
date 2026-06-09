import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    pagination: null,
    loading: false,
    error: null,
}

const skillSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        setSkills: (state, action) => {
            state.items = action.payload.skills;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        addSkill: (state, action) => {
            state.items.push(action.payload)
        },
        updateSkill:  (state, action) => {
            const idx = state.items.findIndex(s => s._id === action.payload._id)
            if (idx !== -1) state.items[idx] = action.payload
        },
        removeSkill:  (state, action) => {
            state.items = state.items.filter(s => s._id !== action.payload)
        },
        setLoading: (state, action) => { 
            state.loading = action.payload 
        },
        setError: (state, action) => { 
            state.error   = action.payload 
            state.loading = false 
        },
    }
})

export const { setSkills, addSkill, updateSkill, removeSkill, 
    setLoading, setError } = skillSlice.actions

export default skillSlice.reducer