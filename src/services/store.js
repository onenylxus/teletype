// Import
import { configureStore } from '@reduxjs/toolkit';
import { prefReducer, timerReducer, testerReducer } from './reducer';

// Export
export const store = configureStore({
  reducer: {
    pref: prefReducer,
    timer: timerReducer,
    tester: testerReducer,
  },
});
