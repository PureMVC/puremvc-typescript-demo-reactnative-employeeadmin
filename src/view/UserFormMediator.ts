//
//  UserFormMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Mediator} from "@puremvc/puremvc-typescript-multicore-framework";
import {UserProxy} from "../model/UserProxy";
import {IUserForm} from "./components/UserForm";
import {User} from "../model/valueObject/User";
import {Role} from "../model/valueObject/Role";

export class UserFormMediator extends Mediator {

  public static NAME = "UserFormMediator";

  private userProxy!: UserProxy;

  constructor(delegate: any) {
    super(UserFormMediator.NAME, delegate);
  }

  public onRegister() {
    this.delegate.findAllDepartments = (signal: AbortSignal) => this.findAllDepartments(signal);
    this.delegate.findById = (id: number, signal: AbortSignal) => this.findById(id, signal);
    this.delegate.save = (user: User, roles: Role[]) => this.save(user, roles);
    this.delegate.update = (user: User, roles: Role[]) => this.update(user, roles);

    this.userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
  }

  private async findAllDepartments(signal: AbortSignal) {
    return await this.userProxy.findAllDepartments(signal);
  }

  private async findById(id: number, signal: AbortSignal) {
    return await this.userProxy.findById(id, signal);
  }

  private async save(user: User, roles: Role[]) {
    user.roles = roles;
    await this.userProxy.save(user);
  }

  private async update(user: User, roles: Role[]) {
    user.roles = roles;
    await this.userProxy.update(user);
  }

  public get delegate(): IUserForm {
    return this.viewComponent
  }

}
