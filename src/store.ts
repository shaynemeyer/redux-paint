import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import historyIndex from './modules/historyIndex/slice';
import { currentStroke } from './modules/currentStroke/slice';
import strokes from './modules/strokes/slice';
import { modalVisible } from './modules/modals/slice';
import { projectsList } from './modules/projectList/slice';
import { logger } from 'redux-logger';
import { RootState } from './utils/types';

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    historyIndex,
    strokes,
    currentStroke,
    modalVisible,
    projectsList,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
