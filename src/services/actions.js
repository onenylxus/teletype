export const setType        = (payload) => ({ type: 0x00, payload });
export const setLimit       = (payload) => ({ type: 0x01, payload });
export const setTheme       = (payload) => ({ type: 0x02, payload });

export const setTimer       = (payload) => ({ type: 0x10, payload });
export const setTimerId     = (payload) => ({ type: 0x11, payload });
export const decTimer       = (payload) => ({ type: 0x12, payload });

export const setWord        = (payload) => ({ type: 0x20, payload });
export const setChar        = (payload) => ({ type: 0x21, payload });
export const setList        = (payload) => ({ type: 0x22, payload });
export const appendTyped    = (payload) => ({ type: 0x23, payload });
export const prevWord       = (payload) => ({ type: 0x24, payload });
export const setRef         = (payload) => ({ type: 0x25, payload });
export const setCaretRef    = (payload) => ({ type: 0x26, payload });
