import { store } from '../store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 