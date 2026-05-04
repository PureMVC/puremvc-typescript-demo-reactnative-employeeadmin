//
//  UserListMediator.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Mediator} from "@puremvc/puremvc-typescript-multicore-framework";
import {UserProxy} from "../model/UserProxy";
import {IUserList} from "./components/UserList";

export class UserListMediator extends Mediator {

  public static NAME = "UserListMediator";

  private userProxy!: UserProxy;

  constructor(delegate: any) {
    super(UserListMediator.NAME, delegate);
  }

  public onRegister() {
    this.delegate.findAll = (signal: AbortSignal) => this.findAll(signal);
    this.delegate.deleteById = (id: number) => this.deleteById(id);

    this.userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
  }

  private async findAll(signal: AbortSignal) {
    return await this.userProxy.findAll(signal);
  }

  private async deleteById(id: number): Promise<void> {
    await this.userProxy.deleteById(id);
  }

  public get delegate(): IUserList {
    return this.viewComponent
  }

}
