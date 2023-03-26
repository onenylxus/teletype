// Import
import { setTimerId, decTimer } from './actions';
import { store } from './store';

// Start function
export const start = () => {
  const { dispatch } = store;
  const timerId = setInterval(() => { dispatch(decTimer()); }, 1000);

  dispatch(setTimerId(timerId));
};
