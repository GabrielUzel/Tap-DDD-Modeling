import { describe, it, expect } from "bun:test";
import { Role } from "../../../domain/@shared/value-objects/role.value";

describe("Role value object tests", () => {
  describe("Factory (fromString)", () => {
    it("Should create CASHIER from 'cashier' and 'CASHIER'", () => {
      expect(Role.fromString("cashier").isCashier()).toBeTrue();
      expect(Role.fromString("CASHIER").isCashier()).toBeTrue();
    });

    it("Should create MANAGER from 'manager' and 'Manager'", () => {
      expect(Role.fromString("manager").isManager()).toBeTrue();
      expect(Role.fromString("Manager").isManager()).toBeTrue();
    });

    it("Should create ADMIN and STOCKER case insensitive", () => {
      expect(Role.fromString("ADMIN").isAdmin()).toBeTrue();
      expect(Role.fromString("Stocker").isStocker()).toBeTrue();
    });

    it("Should throw error for invalid role", () => {
      expect(() => Role.fromString("superuser")).toThrowError(
        "Invalid role type",
      );
    });
  });

  describe("Methods", () => {
    it("equals should return true for same role", () => {
      expect(Role.CASHIER.equals(Role.CASHIER)).toBeTrue();
      expect(Role.CASHIER.equals(Role.ADMIN)).toBeFalse();
    });

    it("getValue should return lowercase string", () => {
      expect(Role.CASHIER.getValue()).toBe("cashier");
    });
  });
});
