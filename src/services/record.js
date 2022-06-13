import { setChar, appendTyped, prevWord } from './actions';
import { reset } from './reset';
import { start } from './start';
import { store } from './store';

function backspace() {
  const { dispatch, getState } = store;
  const {
    tester: { list, history, current, typed, ref },
  } = getState();
  const index = list.indexOf(current);
  const element = ref.current;

  if (typed.length === 0 && history[index - 1] !== list[index - 1]) {
    dispatch(prevWord());
    element.previousElementSibling.classList.remove('right', 'wrong');
  } else {
    dispatch(setChar(typed.slice(0, typed.length - 1)));
  }
}

export const record = (key) => {
  const { dispatch, getState } = store;
  const {
    pref: { limit },
    timer: { now, id },
    tester: { list, history, current, typed, ref, caretRef },
  } = getState();

  console.log({
    pref: { limit },
    timer: { now, id },
    tester: { list, history, current, typed, ref, caretRef },
  });

  if (now === 0) {
    if (key === 'Tab') {
      reset();
    }
    return;
  }

  if (id === null && key !== 'Tab') {
    start();
  }

  const element = ref.current;
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const caret = caretRef.current;
  caret.classList.remove('blink');
  setTimeout(() => caret.classList.add('blink'), 500);

  switch (key) {
    case ' ':
      if (typed !== '') {
        element.classList.add(typed !== current ? 'wrong' : 'right');
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
