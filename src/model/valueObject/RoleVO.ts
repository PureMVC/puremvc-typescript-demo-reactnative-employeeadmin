//
//  RoleVO.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {RoleEnum} from "../enum/RoleEnum";

export interface RoleVO {
  username: string;
  roles: RoleEnum[];
}
