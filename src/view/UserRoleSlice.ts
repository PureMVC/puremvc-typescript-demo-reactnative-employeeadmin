//
//  UserRoleSlice.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {createSlice} from "@reduxjs/toolkit";
import {Role} from "../model/valueObject/Role"
import {findAll, findByUserId} from "../model/RoleThunk";

interface IUserRoleState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
}

export default createSlice({
  name: "UserRoleSlice",

  initialState: {
    roles: [],
    isLoading: false,
    error: null
  } as IUserRoleState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(findAll.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(findAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload;
      })
      .addCase(findAll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      })

      .addCase(findByUserId.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(findByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(findByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      });
  }
}).reducer;
