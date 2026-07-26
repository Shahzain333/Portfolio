import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import experienceReducer from './slices/experienceSlice';
import skillReducer from './slices/skillSlice';
import themeReducer from './slices/themeSlice';

// Guard — fails loudly at startup with a helpful message
// const reducers = { authReducer, projectReducer, experienceReducer, skillReducer, themeReducer };
// Object.entries(reducers).forEach(([name, fn]) => {
//     if (typeof fn !== 'function') {
//         throw new Error(
//             `❌ Redux: "${name}" is ${typeof fn}, not a function.\n` +
//             `Check the slice file — you may have written .reducers instead of .reducer`
//         );
//     }
// });

const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectReducer,
        experiences: experienceReducer,
        skills: skillReducer,
        theme: themeReducer,
    }
});

export default store;