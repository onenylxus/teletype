// Import
import { createReducer } from '@reduxjs/toolkit';
import * as actions from './actions';

// Initial state
const initState = {
  pref: { type: 'words', limit: 60, theme: '' },
  timer: { now: 60, id: null },
  tester: { list: [], history: [], current: '', typed: '' }
};

// Shuffle function
function shuffle(payload) {
  const pool = Array.from(payload);
  const s = pool.every((word) => word.includes(' ')) ? pool.flatMap((token) => token.split(' ')) : pool.sort(() => Math.random() - 0.5);
  return { list: s, history: [], typed: '', current: s[0] };
}

// Append function
function append(state) {
  const i = state.list.indexOf(state.current, state.history.length) + 1;
  return { history: [...state.history, state.typed], current: state.list[i], typed: '' };
}

// Previous function
function previous(state) {
  const i = state.list.indexOf(state.current) - 1;
  return { history: state.history.slice(0, state.history.length - 1), current: state.list[i], typed: state.history[i] };
}

// Preference reducer
export const prefReducer = createReducer(initState.pref, (builder) => {
  builder
    .addCase(actions.setType, (state, { payload }) => ({ ...state, type: payload }))
    .addCase(actions.setLimit, (state, { payload }) => ({ ...state, limit: payload }))
    .addCase(actions.setTheme, (state, { payload }) => ({ ...state, theme: payload }));
});

// Timer reducer
export const timerReducer = createReducer(initState.timer, (builder) => {
  builder
    .addCase(actions.setTimer, (state, { payload }) => ({ ...state, now: payload }))
    .addCase(actions.setTimerId, (state, { payload }) => ({ ...state, id: payload }))
    .addCase(actions.decTimer, (state) => ({ ...state, now: state.now - 1 }));
});

// Tester reducer
export const testerReducer = createReducer(initState.tester, (builder) => {
  builder
    .addCase(actions.setWord, (state, { payload }) => ({ ...state, history: [...state.history, payload] }))
    .addCase(actions.setChar, (state, { payload }) => ({ ...state, typed: payload }))
    .addCase(actions.setList, (state, { payload }) => ({ ...state, ...shuffle(payload) }))
    .addCase(actions.appendTyped, (state) => ({ ...state, ...append(state) }))
    .addCase(actions.prevWord, (state) => ({ ...state, ...previous(state) }));
});
