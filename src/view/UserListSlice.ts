//
//  UserListSlice.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {createSlice} from "@reduxjs/toolkit";
import {deleteById, findAll} from "../model/UserThunk";
import {User} from "../model/valueObject/User";

interface IUserListState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export default createSlice({
  name: "UserListSlice",

  initialState: {
    users: [],
    isLoading: false,
    error: null
  } as IUserListState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(findAll.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(findAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(findAll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      })

      .addCase(deleteById.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id != action.payload);
      })
      .addCase(deleteById.rejected, (state, action) => {
        state.error = String(action.payload ?? action.error.message);
      });
  }

}).reducer;