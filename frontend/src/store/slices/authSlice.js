import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        admin:        null,
        isLoggedIn:   false,
        loading:      false,
        checkLoading: true,   // true until checkAuth() resolves
        error:        null,
    },
    reducers: {

        adminLogin(state, action) {
            state.isLoggedIn   = true
            state.admin        = action.payload
            state.loading      = false
            state.checkLoading = false  // also clear checkLoading on login
            state.error        = null
        },

        adminLogout(state) {
            state.isLoggedIn   = false
            state.admin        = null
            state.checkLoading = false
        },

        // Called after checkAuth() resolves — MUST always be called
        // whether session is valid or not. This is what unlocks ProtectedRoute.
        setAuthChecked(state, action) {
            state.checkLoading = false                    // ← unlock ProtectedRoute
            state.isLoggedIn   = action.payload.isLoggedIn
            state.admin        = action.payload.admin || null
        },

        setLoading(state, action) { state.loading = action.payload },
        setError(state, action)   { state.error = action.payload; state.loading = false },
        clearError(state)         { state.error = null },
    }
})

export const {
    adminLogin, adminLogout, setAuthChecked,
    setLoading, setError, clearError,
} = authSlice.actions

// Named export prevents .reducers vs .reducer typo
export const authReducer = authSlice.reducer
export default authReducer
