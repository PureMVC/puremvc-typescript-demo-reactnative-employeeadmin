//
//  IUserRole.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {IDelegate} from "./IDelegate";
import {RoleEnum} from "../../model/enum/RoleEnum";

export interface IUserRole extends IDelegate {
  findByUsername: (username: string) => RoleEnum[]
}
