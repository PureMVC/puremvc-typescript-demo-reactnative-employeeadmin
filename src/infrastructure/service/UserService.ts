//
//  UserService.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {User} from "../../domain/model/User";
import {Department} from "../../domain/model/Department";
import {ApplicationConstants} from "../../ApplicationConstants";
import {IUserService} from "../../domain/service/IUserService";

export const userService: IUserService = {

  async findAll(signal?: AbortSignal): Promise<User[]> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            findAll {
              id
              first
              last
            }
          }
        `
      }),
      signal: signal
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    return json.data.findAll;
  },

  async findById(id: number, signal?: AbortSignal): Promise<User | null> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($id: ID!) {
            findById(id: $id) {
              id
              username
              first
              last
              email
              password
              department {
                id
                name
              }
              roles {
                id
                name
              }
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

    return json.data.findById;
  },

  async deleteById(id: number, signal?: AbortSignal): Promise<boolean> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation DeleteById($id: ID!) {
            deleteById(id: $id)
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

    return json.data.deleteById;
  },

  async save(user: Omit<User, "id">, signal?: AbortSignal): Promise<User> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation Save($user: IUser!) {
            save(user: $user) {
              id
              username
              first
              last
              email
              department { id name }
              roles { id name }
            }
          }
        `,
        variables: {
          user: {
            username: user.username,
            first: user.first,
            last: user.last,
            email: user.email,
            password: user.password,
            department: user.department,
            roles: user.roles
          }
        },
      }),
      signal: signal
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    return json.data.save
  },

  async update(user: User, signal?: AbortSignal): Promise<User> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation($user: IUser!) {
            update(user: $user) {
              id
              username
              first
              last
              email
              password
              department {
                id
                name
              }
              roles {
                id
                name
              }
            }
          }
        `,
        variables: {
          user: {
            id: user.id,
            username: user.username,
            first: user.first,
            last: user.last,
            email: user.email,
            password: user.password,
            department: user.department,
            roles: user.roles
          }
        }
      }),
      signal: signal
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    return json.data.update
  },

  async findAllDepartments(signal?: AbortSignal): Promise<Department[]> {
    const response = await fetch(ApplicationConstants.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: `
          query FindAllDepartments {
            findAllDepartments {
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

    return json.data.findAllDepartments;
  }
}
