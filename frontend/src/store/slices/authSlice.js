import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    isLoggedIn: false,
    loading: false,
    checkLoading: true,   // true on first load — prevents flash of login page
    error: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // called when login API succeeds
        adminLogin(state, action) {
            state.isLoggedIn = true;
            state.admin = action.payload;
            state.loading = false;
            state.error = null;
        },
        // called when logout API succeeds
        AdminLogout: state => {
            state.isLoggedIn = false
            state.admin = null
        },
        // called when checkAuth API succeeds on page reload
        setAuthChecked: (state, action) => {
            state.checkLoading = false
            state.isLoggedIn = action.payload.isLoggedIn
            state.admin  = action.payload.admin || null
        },
        setLoading: (state, action) => { 
            state.loading = action.payload 
        },
        setError: (state, action) => { 
            state.error = action.payload 
        },
        clearError: state => { 
            state.error = null 
        },
    }
})

export const { adminLogin, AdminLogout, setAuthChecked, setLoading, setError, 
    clearError } = authSlice.actions;

export default authSlice.reducers;