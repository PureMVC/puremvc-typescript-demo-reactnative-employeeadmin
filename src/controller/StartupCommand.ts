//
//  StartupCommand.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {INotification, SimpleCommand} from "@puremvc/puremvc-typescript-multicore-framework";
import {UserProxy} from "../model/UserProxy";
import {RoleProxy} from "../model/RoleProxy";
import {RegisterCommand} from "./RegisterCommand";
import {ApplicationConstants} from "../ApplicationConstants";
import {UserVO} from "../model/valueObject/UserVO";
import {DeptEnum} from "../model/enum/DeptEnum";
import {RoleEnum} from "../model/enum/RoleEnum";

export class StartupCommand extends SimpleCommand {

  execute(_notification: INotification) {
    this.facade.registerCommand(ApplicationConstants.REGISTER, () => new RegisterCommand());
    this.facade.registerCommand(ApplicationConstants.UNREGISTER, () => new RegisterCommand());

    const userProxy = new UserProxy();
    userProxy.save({username: "lstooge", first: "Larry", last: "Stooge", email: "larry@stooges.com", password: "ijk456", department: DeptEnum.ACCT} as UserVO);
    userProxy.save({username: "cstooge", first: "Curly", last: "Stooge", email: "curly@stooges.com", password: "xyz987", department: DeptEnum.SALES} as UserVO);
    userProxy.save({username: "mstooge", first: "Moe", last: "Stooge", email: "moe@stooges.com", password: "abc123", department: DeptEnum.PLANT} as UserVO);

    const roleProxy = new RoleProxy();
    roleProxy.save({username: "lstooge", roles: [RoleEnum.PAYROLL, RoleEnum.EMP_BENEFITS]});
    roleProxy.save({username: "cstooge", roles: [RoleEnum.ACCT_PAY, RoleEnum.ACCT_RCV, RoleEnum.GEN_LEDGER]});
    roleProxy.save({username: "mstooge", roles: [RoleEnum.INVENTORY, RoleEnum.PRODUCTION, RoleEnum.SALES, RoleEnum.SHIPPING]});

    this.facade.registerProxy(userProxy);
    this.facade.registerProxy(roleProxy);
  }

}
