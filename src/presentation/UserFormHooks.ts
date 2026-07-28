//
//  UserFormHooks.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {useCallback, useState} from "react";
import {createDefaultUser, User} from "../domain/model/User";
import {Department} from "../domain/model/Department";
import {Role} from "../domain/model/Role";
import {useContextProvider} from "../ApplicationContext";

export function useUserForm() {

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [user, setUser] = useState<User>(createDefaultUser());

  const {userService} = useContextProvider();

  // Hooks
  const findAllDepartments = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      setDepartments(await userService.findAllDepartments(signal))
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  const findById = useCallback(async (id: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const result = await userService.findById(id, signal);
      if (result) setUser(result);
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (user: User, roles: Role[] | null, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      if (roles) user.roles = roles;
      user.id === 0 ? await userService.save(user, signal) : await userService.update(user, signal);
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, departments, user, setUser, findAllDepartments, findById, save };
}
