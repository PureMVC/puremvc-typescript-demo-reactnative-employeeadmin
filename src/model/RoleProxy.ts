//
//  RoleProxy.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Proxy} from "@puremvc/puremvc-typescript-multicore-framework";
import {RoleVO} from "./valueObject/RoleVO";
import {RoleEnum} from "./enum/RoleEnum";

export class RoleProxy extends Proxy {

  public static NAME = "RoleProxy";

  constructor() {
    super(RoleProxy.NAME, []);
  }

  public findByUsername(username: string): RoleEnum[] {
    const index = this.data.findIndex((current: RoleVO) => current.username === username);
    return (index >= 0) ? (this.data[index] as RoleVO).roles : [];
  }

  public save(role: RoleVO) {
    this.data.push(role);
  }

  public updateByUsername(username: string, roles: RoleEnum[]) {
    const index = this.data.findIndex((current: RoleVO) => current.username === username);
    (index >= 0) ? this.data[index].roles = roles : this.data.push({username: username, roles: roles});
  }

}
