//
//  RoleThunk.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {createAsyncThunk} from "@reduxjs/toolkit";
import {RoleService} from "./service/RoleService";
import {Role} from "./valueObject/Role";

export const findAll = createAsyncThunk<Role[]>(
  "role/findAll",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await RoleService.findAll(signal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const findByUserId = createAsyncThunk<Role[], number>(
  "role/findByUserId",
  async (id, { signal, rejectWithValue }) => {
    try {
      return await RoleService.findByUserId(id, signal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);
