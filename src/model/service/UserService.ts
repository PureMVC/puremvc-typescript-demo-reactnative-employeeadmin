//
//  UserService.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Platform} from "react-native";
import {User} from "../valueObject/User";
import {Department} from "../valueObject/Department";

export class UserService {

  static async findAll(signal?: AbortSignal): Promise<User[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users`, {signal});

    if (response.status !== 200) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async findById(id: number, signal: AbortSignal): Promise<User> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${id}`, {signal});

    if (response.status !== 200) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async deleteById(id: number, signal?: AbortSignal): Promise<number> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${id}`, {
        method: "DELETE"
      }
    );

    if (response.status !== 204) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return id;
  }

  static async save(user: User) {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(user)
      }
    );

    if (response.status !== 201) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async update(user: User) {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/users/${user.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
      }
    );

    if (response.status !== 200) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

  static async findAllDepartments(signal: AbortSignal): Promise<Department[]> {
    const response = await fetch(`${Platform.OS === "android" ? "http://10.0.2.2" : "http://127.0.0.1"}/departments`, {signal});

    if (response.status !== 200) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? `Request failed: ${response.status}`);
    }

    return await response.json();
  }

}
