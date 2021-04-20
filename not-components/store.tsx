import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {mainReducer} from './reducer';
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
  main: mainReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
