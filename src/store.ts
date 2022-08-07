import { rootReducer } from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger))
);
