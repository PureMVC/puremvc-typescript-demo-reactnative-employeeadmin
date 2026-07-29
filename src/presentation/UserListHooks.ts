//
//  UserListHooks.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {useCallback, useState} from "react";
import {User} from "../domain/model/User";
import {useContextProvider} from "../ApplicationContext";

export function useUserList() {

  // Dependencies
  const {userService, deleteUserUseCase} = useContextProvider();

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Hooks
  const findAll = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      setUsers(await userService.findAll(signal));
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [userService]);

  const deleteById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const success = await deleteUserUseCase(userService).execute(id);
      if (success) setUsers((prev) => prev.filter((current) => current.id !== id));
    } catch (e) {
      if (error instanceof Error && error.name === "AbortError") return;
      setError(e instanceof Error ? e : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [userService]);

  return {loading, error, users, setUsers, findAll, deleteById};
}
