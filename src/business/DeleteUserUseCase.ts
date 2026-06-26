//
//  DeleteUserUseCase.ts
//  PureMVC TypeScript Demo - React Native EmployeeAdmin
//
//  Copyright(c) 2026 Saad Shams <saad.shams@puremvc.org>
//  Your reuse is governed by the BSD 3-Clause License
//

import {IUserService} from "../domain/UserService";

export const deleteUserUseCase = (service: IUserService) => {
  return {
    execute(id: number, signal?: AbortSignal): Promise<boolean> {
      return service.deleteById(id, signal);
    }
  };
};
