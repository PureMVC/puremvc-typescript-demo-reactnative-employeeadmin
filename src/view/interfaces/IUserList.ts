//
//  IUserList.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {IDelegate} from "./IDelegate";
import {UserVO} from "../../model/valueObject/UserVO";

export interface IUserList extends IDelegate {
  findAll: () => UserVO[],
  deleteByUsername: (username: string) => void
}
