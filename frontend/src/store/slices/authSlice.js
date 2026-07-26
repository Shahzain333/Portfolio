import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        admin: null,
        isLoggedIn: false,
        loading: false,
        checkLoading: true,
        error: null,
    },
    reducers: {
        adminLogin(state, action) {
            state.isLoggedIn = true;
            state.admin = action.payload;
            state.loading = false;
            state.error = null;
        },
        adminLogout: state => {
            state.isLoggedIn = false;
            state.admin = null;
            state.checkLoading = false;
        },
        setAuthChecked: (state, action) => {
            state.checkLoading = false;
            state.isLoggedIn = action.payload.isLoggedIn;
            state.admin = action.payload.admin || null;
        },
        setLoading: (state, action) => { state.loading = action.payload; },
        setError:   (state, action) => { state.error = action.payload; },
        clearError: state => { state.error = null; },
    }
});

// Destructure actions and reducer together
export const {
    adminLogin,
    adminLogout,
    setAuthChecked,
    setLoading,
    setError,
    clearError,
} = authSlice.actions;

// Named export - can't be confused with .reducers
export const authReducer = authSlice.reducer;

// Default export - same value, explicit variable name prevents typo
export default authReducer;