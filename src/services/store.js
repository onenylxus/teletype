import { configureStore } from 'redux';
import reducer from './reducer';

export const store = configureStore(reducer);
