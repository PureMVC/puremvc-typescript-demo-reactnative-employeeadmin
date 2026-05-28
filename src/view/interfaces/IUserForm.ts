//
//  IUserForm.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {IDelegate} from "./IDelegate";
import {UserVO} from "../../model/valueObject/UserVO";
import {RoleEnum} from "../../model/enum/RoleEnum";

export interface IUserForm extends IDelegate {
  findByUsername: (username: string) => UserVO | undefined,
  save: (user: UserVO, roles: RoleEnum[]) => void,
  update: (user: UserVO, roles: RoleEnum[]) => void,
}
