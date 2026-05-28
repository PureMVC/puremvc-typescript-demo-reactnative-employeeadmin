//
//  UserProxy.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Proxy} from "@puremvc/puremvc-typescript-multicore-framework";
import {UserVO} from "./valueObject/UserVO";

export class UserProxy extends Proxy {

  public static NAME = "UserProxy";

  constructor() {
    super(UserProxy.NAME, []);
  }

  public findAll(): UserVO[] {
    return this.data;
  }

  public findByUsername(username: string): UserVO | undefined {
    const found = this.data.find((current: UserVO) => current.username === username);
    return found ? ({ ...found } as UserVO) : undefined;
  }

  public deleteByUsername(username: string): void {
    this.data = this.data.filter((current: UserVO) => current.username !== username);
  }

  public save(user: UserVO) {
    this.data.push(user);
  }

  public update(user: UserVO) {
    const index = this.data.findIndex((current: UserVO) => current.username === user.username);
    if (index !== -1) this.data[index] = user;
  }

}
