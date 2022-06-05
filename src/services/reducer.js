export const initState = {
  pref: { type: '', limit: 0, theme: '' },
  timer: { current: 0, id: null },
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

function previous(state, payload) {
  const i = state.list.indexOf(state.current) - 1;
  return { history: state.history.splice(0, state.history.length - 1), current: state.list[i], typed: !payload ? state.history[i] : '' };
}

export const prefReducer = (state = initState.pref, { type, payload }) => {
  switch (type & 0x0f) {
    case 0x00: return { ...state, type: payload };
    case 0x01: return { ...state, limit: payload };
    case 0x02: return { ...state, theme: payload };
    default: return state;
  }
};

export const timerReducer = (state = initState.timer, { type, payload }) => {
  switch (type & 0x0f) {
    case 0x00: return { ...state, current: payload };
    case 0x01: return { ...state, id: payload };
    case 0x02: return { ...state, current: state.current - 1 };
    default: return state;
  }
};

export const testerReducer = (state = initState.tester, { type, payload }) => {
  switch (type & 0x0f) {
    case 0x00: return { ...state, history: [...state.history, payload] };
    case 0x01: return { ...state, typed: payload };
    case 0x02: return { ...state, ...shuffle(payload) };
    case 0x03: return { ...state, ...append(state) };
    case 0x04: return { ...state, ...previous(state, payload) };
    case 0x05: return { ...state, ref: payload };
    case 0x06: return { ...state, caretRef: payload };
    default: return state;
  }
};
