// Import
import { setList, setTimer, setTimerId } from './actions';
import { store } from './store';
import library from '../library.json';

// Reset function
export const reset = () => {
  const { dispatch, getState } = store;
  const {
    pref: { limit, type },
    timer: { id },
  } = getState();

  document.querySelectorAll('.wrong, .right').forEach((el) => el.classList.remove('wrong', 'right'));
  if (id) {
    clearInterval(id);
    dispatch(setTimerId(null));
  }
  dispatch(setList(library[type]));
  dispatch(setTimer(limit));
};
