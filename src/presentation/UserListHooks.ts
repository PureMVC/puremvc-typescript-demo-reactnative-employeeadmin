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

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const {userService} = useContextProvider();

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

  return {loading, error, users, setUsers, findAll};
}
