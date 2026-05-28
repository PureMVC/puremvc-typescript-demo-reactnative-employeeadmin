//
//  IUserForm.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {IDelegate} from "./IDelegate";
import {User} from "../../model/valueObject/User";
import {Department} from "../../model/valueObject/Department";
import {Role} from "../../model/valueObject/Role";

export interface IUserForm extends IDelegate {
  findAllDepartments: (signal: AbortSignal) => Promise<Department[]>,
  findById: (id: number, signal: AbortSignal) => Promise<User | null>,
  save: (user: User, roles: Role[]) => Promise<void>,
  update: (user: User, roles: Role[]) => Promise<void>
}
