//
//  ApplicationContext.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import React, { createContext, useContext } from "react";
import { userService } from "./infrastructure/service/UserService";
import { roleService } from "./infrastructure/service/RoleService";
import {deleteUserUseCase} from "./business/DeleteUserUseCase";

export interface IContext {
  userService: typeof userService;
  roleService: typeof roleService;
  deleteUserUseCase: typeof deleteUserUseCase
}

const context: IContext = {
  userService,
  roleService,
  deleteUserUseCase
};

const Context = createContext<IContext | null>(null);

export function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
}

export function useContextProvider(): IContext {
  const context = useContext(Context);

  if (!context) {
    throw new Error("ContextProvider is missing.");
  }

  return context;
}
