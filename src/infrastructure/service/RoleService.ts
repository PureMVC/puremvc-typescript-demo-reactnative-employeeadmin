//
//  RoleService.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {Role} from "../../domain/model/Role";
import {ApplicationConstants} from "../../ApplicationConstants";
import {IRoleService} from "../../domain/service/IRoleService";

export const roleService: IRoleService = {

  async findAll(signal?: AbortSignal): Promise<Role[]> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          query FindAllRoles {
            findAllRoles {
              id
              name
            }
          }
        `
      }),
      signal: signal
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    return json.data.findAllRoles;
  },

  async findByUserId(id: number, signal?: AbortSignal): Promise<Role[]> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          query FindRolesByUserId($id: ID!) {
            findRolesByUserId(id: $id) {
              id
              name
            }
          }
        `,
        variables: {
          id
        }
      }),
      signal: signal
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    return json.data.findRolesByUserId;
  }
}
