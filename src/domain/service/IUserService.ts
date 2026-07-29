//
//  IUserService.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {User} from "../model/User";
import {Department} from "../model/Department";

export interface IUserService {
  findAll(signal?: AbortSignal): Promise<User[]>;
  findById(id: number, signal?: AbortSignal): Promise<User | null>;
  deleteById(id: number, signal?: AbortSignal): Promise<boolean>;
  save(user: Omit<User, "id">, signal?: AbortSignal): Promise<User>;
  update(user: User, signal?: AbortSignal): Promise<User>;
  findAllDepartments(signal?: AbortSignal): Promise<Department[]>;
}
