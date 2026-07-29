//
//  IRoleService.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Role} from "../model/Role";

export interface IRoleService {
  findAll(signal?: AbortSignal): Promise<Role[]>;
  findByUserId(id: number, signal?: AbortSignal): Promise<Role[]>;
}
