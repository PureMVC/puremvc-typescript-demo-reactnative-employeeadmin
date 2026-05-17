//
//  UserRoleMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Mediator} from "@puremvc/puremvc-typescript-multicore-framework";
import {RoleProxy} from "../model/RoleProxy";
import {IUserRole} from "./components/UserRole";

export class UserRoleMediator extends Mediator {

  public static NAME = "UserRoleMediator";

  private roleProxy?: RoleProxy;
  private delegate: IUserRole;

  constructor(delegate: IUserRole) {
    super(UserRoleMediator.NAME, null);
    this.delegate = delegate;
  }

  public onRegister() {
    this.delegate.findByUsername = (username: string) => this.findByUsername(username)

    this.roleProxy = this.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy;
  }

  private findByUsername(username: string) {
    return this.roleProxy?.findByUsername(username) ?? [];
  }

}
