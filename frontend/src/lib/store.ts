import type { Action, ThunkAction } from "@reduxjs/toolkit";
import {combineSlices, configureStore } from '@reduxjs/toolkit'
// import sidebarReducer from './features/sidebar/sidebar-slice'
import {sidebar} from './features/sidebar/sidebar-slice'
import {stationSlice} from "./features/chargingStations/stationSlice"


const rootReducer = combineSlices(sidebar, stationSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer:rootReducer,
    //  {
    //   sidebar: sidebarReducer,
    // },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;