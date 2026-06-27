import { configureStore } from '@reduxjs/toolkit';

// Import slices as you create them
// import authSlice from './slices/authSlice';
// import productsSlice from './slices/productsSlice';

const store = configureStore({
  reducer: {
    // auth: authSlice,
    // products: productsSlice,
  },
});

export default store;
