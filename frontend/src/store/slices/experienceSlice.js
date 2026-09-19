import { createSlice } from '@reduxjs/toolkit'

const experienceSlice = createSlice({
    name: 'experiences',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        setExperiences: (state, action) => {
            // backend returns: { data: [...experiences] } — plain array
            state.items   = Array.isArray(action.payload) ? action.payload : (action.payload?.experiences || action.payload?.data || [])
            state.loading = false
            state.error   = null
        },
        addExperience:    (state, action) => { state.items.unshift(action.payload); state.loading = false },
        updateExperience: (state, action) => {
            const idx = state.items.findIndex(e => e._id === action.payload._id)
            if (idx !== -1) state.items[idx] = action.payload
            state.loading = false
        },
        removeExperience: (state, action) => {
            state.items   = state.items.filter(e => e._id !== action.payload)
            state.loading = false
        },
        setLoading: (state, action) => { state.loading = action.payload },
        setError:   (state, action) => { state.error = action.payload; state.loading = false },
    }
})

export const { setExperiences, addExperience, updateExperience, removeExperience, setLoading, setError } = experienceSlice.actions
export default experienceSlice.reducer
