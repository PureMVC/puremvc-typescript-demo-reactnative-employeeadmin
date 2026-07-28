import { describe, it, expect } from "vitest";
import {roleService} from "../../../src/infrastructure/service/RoleService";

describe("roleService integration", () => {
  it("findAll should fetch roles from real API", async () => {
    const roles = await roleService.findAll();

    expect(Array.isArray(roles)).toBe(true);

    if (roles.length > 0) {
      expect(roles[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });

  it("findByUserId should fetch roles for a real user", async () => {
    const roles = await roleService.findByUserId(1);
    console.log(roles);

    expect(Array.isArray(roles)).toBe(true);

    for (const role of roles) {
      expect(role).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
      });
    }
  });
});