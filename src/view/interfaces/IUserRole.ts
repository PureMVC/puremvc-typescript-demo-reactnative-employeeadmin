//
//  IUserRole.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {IDelegate} from "./IDelegate";
import {Role} from "../../model/valueObject/Role";

export interface IUserRole extends IDelegate {
  findAll: (signal: AbortSignal) => Promise<Role[]>,
  findByUserId: (id: number, signal: AbortSignal) => Promise<Role[]>
}
