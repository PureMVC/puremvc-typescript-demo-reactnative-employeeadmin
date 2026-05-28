//
//  UserVO.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {DeptEnum} from "../enum/DeptEnum";

export interface UserVO {
  username: string;
  first: string;
  last: string;
  email: string;
  password: string;
  confirm: string;
  department: DeptEnum;
}

export function createDefaultUser(): UserVO {
  return {
    username: "",
    first: "",
    last: "",
    email: "",
    password: "",
    confirm: "",
    department: DeptEnum.NONE_SELECTED
  };
}

export function validate(user: UserVO): string | null {
  if (!user.username.trim()) return "Username is required.";
  if (!user.first.trim()) return "First name is required.";
  if (!user.last.trim()) return "Last name is required.";

  if (!user.email.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) return "Invalid email format.";

  if (!user.password.trim()) return "Password is required.";
  if (!user.confirm.trim()) return "Confirm password is required.";
  if (user.password !== user.confirm) return "Password and confirm password must match.";

  if (user.department === DeptEnum.NONE_SELECTED) return "Please select a department.";

  return null;
}
