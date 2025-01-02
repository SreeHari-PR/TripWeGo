// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
// src/redux/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// import { combineReducers } from 'redux';

// // Define persist config
// const persistConfig = {
//   key: 'root', // key for localStorage
//   storage,
// };

// // Combine reducers if you have more than one slice
// const rootReducer = combineReducers({
//   auth: authReducer,
// });

// // Create a persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure the store
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Ignore non-serializable actions for redux-persist
//     }),
// });

// // Create persistor
// export const persistor = persistStore(store);

// export default store;
