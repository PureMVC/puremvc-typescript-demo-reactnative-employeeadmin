//
//  RoleProxy.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Proxy} from "@puremvc/puremvc-typescript-multicore-framework";
import {Role} from "./valueObject/Role";
import {Platform} from "react-native";

export class RoleProxy extends Proxy {

  public static NAME = "RoleProxy";

  constructor() {
    super(RoleProxy.NAME, null);
  }

  public async findAll(signal: AbortSignal): Promise<Role[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/roles`, {signal});
    if (response.status === 200) {
      return await response.json();
    } else {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }
  }

  public async findByUserId(id: number, signal: AbortSignal): Promise<Role[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${id}/roles`, {signal});
    if (response.status === 200) {
      return await response.json();
    } else {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }
  }
}
