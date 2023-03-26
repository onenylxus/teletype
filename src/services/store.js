// Import
import { createStore } from 'redux';
import { reducer } from './reducer';

// Export
export const store = createStore(reducer);
