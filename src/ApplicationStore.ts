//
//  ApplicationStore.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {configureStore} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import UserListSlice from "./view/UserListSlice"
import UserFormSlice from "./view/UserFormSlice";
import UserRoleSlice from "./view/UserRoleSlice";

export const store = configureStore({
  reducer: {
    UserListSlice,
    UserFormSlice,
    UserRoleSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
