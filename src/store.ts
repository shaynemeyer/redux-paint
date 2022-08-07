import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as historyIndex } from "./modules/historyIndex/reducer";
import { reducer as currentStroke } from "./modules/currentStroke/reducer";
import { reducer as strokes } from "./modules/strokes/reducer";

import { logger } from "redux-logger";

export const store = createStore(
  combineReducers({
    historyIndex,
    currentStroke,
    strokes,
  }),
  composeWithDevTools(applyMiddleware(logger))
);
