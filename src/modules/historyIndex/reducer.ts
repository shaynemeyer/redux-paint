import { createReducer } from '@reduxjs/toolkit';
import { RootState } from '../../utils/types';
import { undo, redo } from './actions';
import { endStroke } from '../sharedActions';

const initialState: RootState['historyIndex'] = 0;

export const reducer = createReducer(initialState, (builder) => {
  builder.addCase(undo, (state, action) => {
    return Math.min(state + 1, action.payload);
  });

  builder.addCase(redo, (state) => {
    return Math.max(state - 1, 0);
  });

  builder.addCase(endStroke, () => {
    return 0;
  });
});

/*
Note that here we return a new value instead of updating it like in other reducers. 
That’s because of Immer. You can’t re-define the whole state. If you need to do this, you have to return a new value instead.

In other reducers, we were updating the individual fields of the state. 
In this case, you can just mutate the state and Immer will internally generate the new state, based on the mutations you’ve made.
*/
export const historyIndexSelector = (state: RootState) => state.historyIndex;
