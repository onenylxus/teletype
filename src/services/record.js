// Import
import { setChar, appendTyped, prevWord } from './actions';
import { reset } from './reset';
import { start } from './start';
import { store } from './store';

// Backspace function
function backspace() {
  const { dispatch, getState } = store;
  const {
    tester: { list, history, current, typed },
  } = getState();
  const index = list.indexOf(current);
  const element = document.getElementsByClassName('word')[history.length];

  if (typed.length === 0 && history[index - 1] !== list[index - 1]) {
    dispatch(prevWord());
    element.previousElementSibling.classList.remove('right', 'wrong');
  } else {
    dispatch(setChar(typed.slice(0, typed.length - 1)));
  }
}

// Record function
export const record = (key) => {
  const { dispatch, getState } = store;
  const {
    pref: { limit },
    timer: { now, id },
    tester: { history, current, typed },
  } = getState();

  if (now === 0) {
    if (key === 'Tab') {
      reset();
    }
    return;
  }

  if (id === null && key !== 'Tab') {
    start();
  }

  const element = document.getElementsByClassName('word')[history.length];
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const caret = document.getElementById('caret');
  caret.classList.remove('blink');
  setTimeout(() => caret.classList.add('blink'), 500);

  switch (key) {
    case ' ':
      if (typed !== '') {
        element.classList.add(typed === current ? 'right' : 'wrong');
        dispatch(appendTyped());
      }
      break;

    case 'Backspace':
      backspace();
      break;

    case 'Tab':
      if (now !== limit || id) {
        reset();
        document.getElementsByClassName('word')[0].scrollIntoView();
      }
      break;

    default:
      dispatch(setChar(typed + key));
  }
};
