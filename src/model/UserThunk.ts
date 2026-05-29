//
//  UserThunk.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {createAsyncThunk} from "@reduxjs/toolkit";
import {User} from "./valueObject/User";
import {Department} from "./valueObject/Department";
import {UserService} from "./service/UserService";

export const findAll = createAsyncThunk<User[]>(
  "user/findAll",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await UserService.findAll(signal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const findById = createAsyncThunk<User, number>(
  "user/findById",
  async (id, { signal, rejectWithValue }) => {
    try {
      return await UserService.findById(id, signal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const deleteById = createAsyncThunk<number, number>(
  "user/deleteById",
  async (id, { signal, rejectWithValue }) => {
    try {
      return await UserService.deleteById(id, signal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const save = createAsyncThunk<User, User>(
  "user/save",
  async (user, { signal, rejectWithValue }) => {
    try {
      return await UserService.save(user);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const update = createAsyncThunk<User, User>(
  "user/update",
  async (user, { signal, rejectWithValue }) => {
    try {
      return await UserService.update(user);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
);

export const findAllDepartments = createAsyncThunk<Department[]>(
  "user/findAllDepartments",
  async (_, { signal, rejectWithValue }) => {
    try {
      return await UserService.findAllDepartments(signal);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : String(error));
    }
  }
)
