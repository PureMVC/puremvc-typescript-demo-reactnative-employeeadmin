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
    this.delegate.findAll = (signal: AbortSignal) => this.findAll(signal);
    this.delegate.findByUserId = (id: number, signal: AbortSignal) => this.findByUserId(id, signal)

    this.roleProxy = this.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy;
  }

  private async findAll(signal: AbortSignal) {
    return await this.roleProxy?.findAll(signal) ?? [];
  }

  private async findByUserId(id: number, signal: AbortSignal) {
    return await this.roleProxy?.findByUserId(id, signal) ?? [];
  }

}
