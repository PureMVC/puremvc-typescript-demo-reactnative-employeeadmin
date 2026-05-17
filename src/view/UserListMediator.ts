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

  private userProxy?: UserProxy;
  private delegate: IUserList;

  constructor(delegate: IUserList) {
    super(UserListMediator.NAME, null);
    this.delegate = delegate;
  }

  public onRegister() {
    this.delegate.findAll = () => this.findAll();
    this.delegate.deleteByUsername = (username: string) => this.deleteByUsername(username);

    this.userProxy = this.facade.retrieveProxy(UserProxy.NAME) as UserProxy;
  }

  private findAll() {
    return this.userProxy?.findAll() ?? [];
  }

  private deleteByUsername(username: string): void {
    this.userProxy?.deleteByUsername(username);
  }

}
