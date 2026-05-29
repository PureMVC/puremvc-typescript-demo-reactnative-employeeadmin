//
//  RoleService.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Platform} from "react-native";
import {Role} from "../valueObject/Role";

export class RoleService {

  static async findAll(signal: AbortSignal): Promise<Role[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/roles`, {signal});

    if (response.status !== 200) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async findByUserId(id: number, signal: AbortSignal): Promise<Role[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${id}/roles`, {signal});

    if (response.status !== 200) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

}
