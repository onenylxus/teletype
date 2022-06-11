import { combineReducers } from 'redux';

export const initState = {
  pref: { type: 'words', limit: 60, theme: '' },
  timer: { now: 60, id: null },
  tester: { list: [], history: [], current: '', typed: '', ref: null, caretRef: null }
};

function shuffle(payload) {
  const s = payload.every((word) => word.includes(' ')) ? payload.flatMap((token) => token.split(' ')) : payload.sort(() => Math.random() - 0.5);
  return { list: s, history: [], typed: '', current: s[0] };
}

function append(state) {
  const i = state.list.indexOf(state.current, state.history.length) + 1;
  return { history: [...state.history, state.typed], current: state.list[i], typed: '' };
}

function previous(state) {
  const i = state.list.indexOf(state.current) - 1;
  return { history: state.history.splice(0, state.history.length - 1), current: state.list[i], typed: state.history[i] };
}

const prefReducer = (state = initState.pref, { type, payload }) => {
  switch (type) {
    case 0x00: return { ...state, type: payload };
    case 0x01: return { ...state, limit: payload };
    case 0x02: return { ...state, theme: payload };
    default: return state;
  }
};

const timerReducer = (state = initState.timer, { type, payload }) => {
  switch (type) {
    case 0x10: return { ...state, now: payload };
    case 0x11: return { ...state, id: payload };
    case 0x12: return { ...state, now: state.now - 1 };
    default: return state;
  }
};

const testerReducer = (state = initState.tester, { type, payload }) => {
  switch (type) {
    case 0x20: return { ...state, history: [...state.history, payload] };
    case 0x21: return { ...state, typed: payload };
    case 0x22: return { ...state, ...shuffle(payload) };
    case 0x23: return { ...state, ...append(state) };
    case 0x24: return { ...state, ...previous(state) };
    case 0x25: return { ...state, ref: payload };
    case 0x26: return { ...state, caretRef: payload };
    default: return state;
  }
};

export const reducer = combineReducers({
  pref: prefReducer,
  timer: timerReducer,
  tester: testerReducer,
});
