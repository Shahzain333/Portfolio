import { createSlice } from '@reduxjs/toolkit'

const skillSlice = createSlice({
    name: 'skills',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        setSkills: (state, action) => {
            // backend returns: { data: [...skills] } — plain array, no pagination
            state.items   = Array.isArray(action.payload) ? action.payload : (action.payload?.skills || action.payload?.data || [])
            state.loading = false
            state.error   = null
        },
        addSkill:    (state, action) => { state.items.push(action.payload); state.loading = false },
        updateSkill: (state, action) => {
            const idx = state.items.findIndex(s => s._id === action.payload._id)
            if (idx !== -1) state.items[idx] = action.payload
            state.loading = false
        },
        removeSkill: (state, action) => {
            state.items   = state.items.filter(s => s._id !== action.payload)
            state.loading = false
        },
        setLoading: (state, action) => { state.loading = action.payload },
        setError:   (state, action) => { state.error = action.payload; state.loading = false },
    }
})

export const { setSkills, addSkill, updateSkill, removeSkill, setLoading, setError } = skillSlice.actions
export default skillSlice.reducer
