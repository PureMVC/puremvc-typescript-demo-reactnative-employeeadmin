//
//  ApplicationConstants.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {UserVO} from "./model/valueObject/UserVO";
import {RoleEnum} from "./model/enum/RoleEnum";

export class ApplicationConstants {
  public static KEY: string = "employeeAdmin";

  public static STARTUP: string = "startup";
  public static REGISTER: string = "register";
  public static UNREGISTER: string = "unregister";

  static USER_LIST = "userList";
  static USER_FORM = "userForm";
  static USER_ROLE = "userRole";
}

export type ParamList = {
  UserList: undefined;
  UserForm: { user: Partial<UserVO>, roles?: RoleEnum[], mode: "create" | "edit"  };
  UserRole: { user: UserVO, roles: RoleEnum[], mode: "create" | "edit" };
};
