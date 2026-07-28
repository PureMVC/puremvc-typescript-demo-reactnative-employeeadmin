import { describe, it, expect } from "vitest";
import { userService } from "../../../src/domain/service/IUserService";

describe("userService integration", () => {

  it("should fetch users", async () => {
    const users = await userService.findAll();

    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
  });

  it("should fetch user by id", async () => {
    const user = await userService.findById(1);

    expect(user).not.toBeNull();
    expect(user?.id).toBe("1");
  });

  it("should return expected fields", async () => {
    const user = await userService.findById(1);

    expect(user).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
      first: expect.any(String),
      last: expect.any(String),
    });
  });

});