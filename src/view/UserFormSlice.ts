//
//  UserFormSlice.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {createSlice} from "@reduxjs/toolkit";
import {Department} from "../model/valueObject/Department";
import {findAllDepartments, findById, save, update} from "../model/UserThunk";

interface IUserFormState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
}

export default createSlice({
  name: "UserFormSlice",

  initialState: {
    departments: [],
    isLoading: false,
    error: null
  } as IUserFormState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(findAllDepartments.pending, (state, action) => {
          state.isLoading = true;
          state.error = null;
      })
      .addCase(findAllDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
      })
      .addCase(findAllDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      })

      .addCase(findById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(findById.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(findById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      })

      .addCase(save.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(save.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(save.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      })

      .addCase(update.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(update.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload ?? action.error.message);
      })
  }
}).reducer;
