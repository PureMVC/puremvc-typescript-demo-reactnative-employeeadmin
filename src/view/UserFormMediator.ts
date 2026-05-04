//
//  UserFormMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Mediator} from "@puremvc/puremvc-typescript-multicore-framework";
import {IUserForm} from "./components/UserForm";
import {UserVO} from "../model/valueObject/UserVO";
import {RoleEnum} from "../model/enum/RoleEnum";
import {RoleProxy} from "../model/RoleProxy";
import {UserProxy} from "../model/UserProxy";

export class UserFormMediator extends Mediator {

  public static NAME = "UserFormMediator";

  private userProxy!: UserProxy;
  private roleProxy!: RoleProxy;

  constructor(delegate: any) {
    super(UserFormMediator.NAME, delegate);
  }

  public onRegister() {
    this.delegate.findByUsername = (username: string) => this.findByUsername(username);
    this.delegate.save = (user: UserVO, roles: RoleEnum[]) => this.save(user, roles);
    this.delegate.update = (user: UserVO, roles: RoleEnum[]) => this.update(user, roles);

    this.userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
    this.roleProxy = this.facade.retrieveProxy(RoleProxy.NAME) as RoleProxy;
  }

  private findByUsername(username: string) {
    return this.userProxy.findByUsername(username);
  }

  private save(user: UserVO, roles: RoleEnum[]) {
    this.userProxy.save(user);
    this.roleProxy.updateByUsername(user.username, roles);
  }

  private update(user: UserVO, roles: RoleEnum[]) {
    this.userProxy.update(user);
    this.roleProxy.updateByUsername(user.username, roles);
  }

  public get delegate(): IUserForm {
    return this.viewComponent
  }

}
