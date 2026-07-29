//
//  UserRoleHooks.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {useCallback, useState} from "react";
import {Role} from "../domain/model/Role";
import {useContextProvider} from "../ApplicationContext";

export function useUserRole() {

  // Dependencies
  const {roleService} = useContextProvider();

  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [data, setData] = useState<Role[]>([]);

  // Hooks
  const findAll = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      setRoles(await roleService.findAll(signal));
    } catch (e) {
      if (error instanceof Error && error.name === "AbortError") return;
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  const findByUserId = useCallback(async (id: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      setData(await roleService.findByUserId(id, signal))
    } catch (e) {
      if (error instanceof Error && error.name === "AbortError") return;
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, roles, data, setData, findAll, findByUserId };
}
