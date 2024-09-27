// Import
import { createAction } from '@reduxjs/toolkit';

// Export
export const setType = createAction('pref/setType');
export const setLimit = createAction('pref/setLimit');
export const setTheme = createAction('pref/setTheme');
export const setTimer = createAction('timer/setTimer');
export const setTimerId = createAction('timer/setTimerId');
export const decTimer = createAction('timer/decTimer');
export const setWord = createAction('tester/setWord');
export const setChar = createAction('tester/setChar');
export const setList = createAction('tester/setList');
export const appendTyped = createAction('tester/appendTyped');
export const prevWord = createAction('tester/prevWord');
