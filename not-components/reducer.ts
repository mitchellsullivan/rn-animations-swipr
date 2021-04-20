import {createAction, createReducer} from "@reduxjs/toolkit";

export const incIndex = createAction('INC_INDEX');
export const refreshData = createAction('REFRESH_DATA');
export const changeRotateEnd = createAction<number>('CHANGE_ROTATE_END');

export interface ICardData {
  id: number;
  text: string;
  uri: string;
}
export const DATA: ICardData[] = [
  { id: 1, text: 'Card #1', uri: 'https://source.unsplash.com/random/?hen', },
  { id: 2, text: 'Card #2', uri: 'https://source.unsplash.com/random/?hen', },
  { id: 3, text: 'Card #3', uri: 'https://source.unsplash.com/random/?hen', },
];

////
// Main App
////
export enum TouchedCardEnd {
  TOP = 1,
  BOTTOM = -1,
}

export enum SwipeDirection {
  RIGHT = 1,
  LEFT = -1
}

export interface MainState {
  index: number,
  data: ICardData[],
  rotationDir: TouchedCardEnd
}

export const initialState: MainState = {
  index: 0,
  data: [...DATA],
  rotationDir: TouchedCardEnd.TOP
}

export const mainReducer = createReducer(initialState, (builder) => {
  console.log("reducing");
  builder
    .addCase(incIndex, (state, action) => {
      return {
        ...state,
        index: state.index + 1
      }
    })
    .addCase(refreshData, (state, action) => {
      return {
        ...state,
        data: [...DATA],
        index: 0
      }
    })
    .addCase(changeRotateEnd, (state, action) => {
      return {
        ...state,
        rotationDir: action.payload
      }
    })
    .addDefaultCase((state, action) => {
      return state;
    })
})


